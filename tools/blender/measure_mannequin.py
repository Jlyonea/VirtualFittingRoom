"""Measures a mannequin exported as .glb to calibrate its shape keys in the front-end.

For the basis and for each shape key at full influence (the others at zero), it reports the
body height and the chest, waist and hip circumferences in centimeters, measured the same way
as a tape measure (convex hull of the torso cross-section):
- chest: largest circumference in the chest band;
- waist: smallest circumference in the waist band;
- hip: largest circumference in the hip band.

Usage (Blender bundles its own Python, nothing else to install):
	blender --background --factory-startup --python tools/blender/measure_mannequin.py -- <model.glb> [output.json]

Default output: <model>.measurements.json next to the .glb file.
"""

import json
import math
import sys
from pathlib import Path

import bpy

CENTIMETERS_PER_METER = 100.0
SAMPLES_PER_BAND = 20
EXPECTED_SHAPE_KEYS = ("chest_incr", "chest_decr", "waist_incr", "waist_decr", "hip_incr", "hip_decr")
EXPECTED_HEIGHT_RANGE_CM = (100.0, 250.0)
NOT_CROSSING = -1

# Height bands (fraction of the body height, from the floor) where each measurement is searched.
CHEST_BAND = (0.67, 0.73)
WAIST_BAND = (0.57, 0.65)
HIP_BAND = (0.46, 0.55)


def parse_arguments():
	arguments = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
	if not arguments:
		raise SystemExit("Usage: blender --background --python measure_mannequin.py -- <model.glb> [output.json]")

	model_path = Path(arguments[0]).resolve()
	output_path = Path(arguments[1]).resolve() if len(arguments) > 1 else model_path.with_suffix(".measurements.json")
	return model_path, output_path


def clear_scene():
	for scene_object in list(bpy.data.objects):
		bpy.data.objects.remove(scene_object, do_unlink=True)


def import_mesh(model_path):
	if not model_path.is_file():
		raise SystemExit(f"Model not found: {model_path}")

	clear_scene()
	bpy.ops.import_scene.gltf(filepath=str(model_path))
	meshes = [scene_object for scene_object in bpy.context.scene.objects if scene_object.type == "MESH"]

	if len(meshes) != 1:
		raise SystemExit(f"Expected exactly one mesh in {model_path.name}, found {len(meshes)}.")

	return meshes[0]


def shape_key_names(mesh_object):
	shape_keys = mesh_object.data.shape_keys
	if shape_keys is None:
		raise SystemExit("The mesh has no shape keys. Check 'Shape Keys' in the glTF export options.")

	return [key_block.name for key_block in shape_keys.key_blocks[1:]]


def warn_missing_shape_keys(names):
	missing = [name for name in EXPECTED_SHAPE_KEYS if name not in names]
	if missing:
		print(f"WARNING: missing shape keys: {', '.join(missing)}")


def activate_shape_key(mesh_object, active_name=None):
	for key_block in mesh_object.data.shape_keys.key_blocks[1:]:
		key_block.value = 1.0 if key_block.name == active_name else 0.0

	bpy.context.view_layer.update()


def edge_plane_intersection(start, end, plane_z):
	if (start.z - plane_z) * (end.z - plane_z) >= 0:
		return None

	ratio = (plane_z - start.z) / (end.z - start.z)
	return (start.x + (end.x - start.x) * ratio, start.y + (end.y - start.y) * ratio)


def slice_mesh(positions, faces, plane_z):
	point_index_by_edge = {}
	points = []
	links = []

	for edge_keys in faces:
		crossing = []

		for edge in edge_keys:
			index = point_index_by_edge.get(edge)

			if index is None:
				point = edge_plane_intersection(positions[edge[0]], positions[edge[1]], plane_z)
				index = NOT_CROSSING if point is None else len(points)
				point_index_by_edge[edge] = index
				if point is not None:
					points.append(point)

			if index != NOT_CROSSING:
				crossing.append(index)

		links.extend(zip(crossing, crossing[1:]))

	return points, links


def connected_components(count, links):
	parent = list(range(count))

	def find(index):
		while parent[index] != index:
			parent[index] = parent[parent[index]]
			index = parent[index]
		return index

	for first, second in links:
		first_root, second_root = find(first), find(second)
		if first_root != second_root:
			parent[first_root] = second_root

	groups = {}
	for index in range(count):
		groups.setdefault(find(index), []).append(index)

	return list(groups.values())


def centroid(points):
	return (sum(point[0] for point in points) / len(points), sum(point[1] for point in points) / len(points))


def cross_product(origin, first, second):
	return (first[0] - origin[0]) * (second[1] - origin[1]) - (first[1] - origin[1]) * (second[0] - origin[0])


def half_hull(points):
	hull = []
	for point in points:
		while len(hull) >= 2 and cross_product(hull[-2], hull[-1], point) <= 0:
			hull.pop()
		hull.append(point)
	return hull


def convex_hull_perimeter(points):
	unique = sorted(set(points))
	if len(unique) < 3:
		return 0.0

	hull = half_hull(unique)[:-1] + half_hull(list(reversed(unique)))[:-1]
	return sum(math.dist(hull[index], hull[(index + 1) % len(hull)]) for index in range(len(hull)))


def torso_circumference(positions, faces, plane_z, body_center):
	points, links = slice_mesh(positions, faces, plane_z)
	if not points:
		return 0.0

	components = [[points[index] for index in component] for component in connected_components(len(points), links)]
	torso = min(components, key=lambda component: math.dist(centroid(component), body_center))
	return convex_hull_perimeter(torso)


def band_heights(floor_z, height, band):
	low, high = band
	step = (high - low) / (SAMPLES_PER_BAND - 1)
	return [floor_z + height * (low + step * index) for index in range(SAMPLES_PER_BAND)]


def band_circumferences(positions, faces, floor_z, height, band, body_center):
	return [torso_circumference(positions, faces, plane_z, body_center) for plane_z in band_heights(floor_z, height, band)]


def to_centimeters(meters):
	return round(meters * CENTIMETERS_PER_METER, 1)


def measure_body(positions, faces):
	floor_z = min(position.z for position in positions)
	height = max(position.z for position in positions) - floor_z
	body_center = (
		(min(position.x for position in positions) + max(position.x for position in positions)) / 2,
		(min(position.y for position in positions) + max(position.y for position in positions)) / 2,
	)

	return {
		"heightCm": to_centimeters(height),
		"chestCm": to_centimeters(max(band_circumferences(positions, faces, floor_z, height, CHEST_BAND, body_center))),
		"waistCm": to_centimeters(min(band_circumferences(positions, faces, floor_z, height, WAIST_BAND, body_center))),
		"hipCm": to_centimeters(max(band_circumferences(positions, faces, floor_z, height, HIP_BAND, body_center))),
	}


def measure_current_state(mesh_object):
	depsgraph = bpy.context.evaluated_depsgraph_get()
	evaluated_object = mesh_object.evaluated_get(depsgraph)
	mesh = evaluated_object.to_mesh()

	try:
		positions = [mesh_object.matrix_world @ vertex.co for vertex in mesh.vertices]
		faces = [list(polygon.edge_keys) for polygon in mesh.polygons]
		return measure_body(positions, faces)
	finally:
		evaluated_object.to_mesh_clear()


def warn_unexpected_height(basis):
	low, high = EXPECTED_HEIGHT_RANGE_CM
	if not low <= basis["heightCm"] <= high:
		print(f"WARNING: height {basis['heightCm']} cm is outside {low}-{high} cm; check the export scale (meters).")


def main():
	model_path, output_path = parse_arguments()
	mesh_object = import_mesh(model_path)
	names = shape_key_names(mesh_object)
	warn_missing_shape_keys(names)

	activate_shape_key(mesh_object)
	basis = measure_current_state(mesh_object)
	warn_unexpected_height(basis)

	measured_shape_keys = {}
	for name in names:
		activate_shape_key(mesh_object, name)
		measured_shape_keys[name] = measure_current_state(mesh_object)

	activate_shape_key(mesh_object)

	result = {"model": model_path.name, "basis": basis, "shapeKeys": measured_shape_keys}
	output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

	print(json.dumps(result, indent=2))
	print(f"Measurements written to {output_path}")


main()
