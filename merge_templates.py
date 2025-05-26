import json
import os

template_files = [
    'public/templates/response_1748281241996.json',
    'public/templates/response_1748281492541.json', 
    'public/templates/response_1748281504076.json',
    'public/templates/response_1748281513263.json',
    'public/templates/response_1748281539476.json'
]

all_exercises = []

for file_path in template_files:
    with open(file_path, 'r') as f:
        data = json.load(f)
        all_exercises.extend(data['exercise_templates'])

compiled_data = {
    'exercise_templates': all_exercises
}

with open('public/workout_templates.json', 'w') as f:
    json.dump(compiled_data, f, indent=2)

print(f'Successfully compiled {len(all_exercises)} exercise templates into workout_templates.json') 