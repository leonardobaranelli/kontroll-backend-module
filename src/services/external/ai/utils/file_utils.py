import os
import shutil
import json
import logging
from typing import Dict, Any

# Creates a backup of the given file.
def create_backup(file_path: str) -> str:
    backup_path = f"{file_path}.bak"
    shutil.copy2(file_path, backup_path)
    logging.info(f"Backup created: {backup_path}")
    return backup_path

# Compares two JSON files and returns True if they are different.
def compare_json_files(file1: str, file2: str) -> bool:
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        return json.load(f1) != json.load(f2)

# Safely renames a file, creating necessary directories.
def safe_rename(src: str, dst: str) -> None:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    os.rename(src, dst)

# Backs up the original file and updates it with new content.
def backup_and_update_file(original_file: str, new_content: Dict[str, Any]) -> None:
    backup_path = create_backup(original_file)
    
    try:
        with open(original_file, 'w') as f:
            json.dump(new_content, f, indent=2)
        logging.info(f"File updated: {original_file}")
    except Exception as e:
        logging.error(f"Error updating file: {e}")
        safe_rename(backup_path, original_file)
        logging.info(f"Restored original file from backup")

# Resets a file by creating a backup and then emptying it.
def reset_file(file_path: str) -> None:
    create_backup(file_path)
    
    try:
        open(file_path, 'w').close()
        logging.info(f"File reset: {file_path}")
    except Exception as e:
        logging.error(f"Error resetting file: {e}")

# Ensures a directory exists, creating it if necessary.
def ensure_dir(directory: str) -> None:
    os.makedirs(directory, exist_ok=True)

# Loads a JSON file and returns its content as a dictionary.
def load_json(file_path: str) -> Dict[str, Any]:
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError:
        logging.error(f"Invalid JSON in file: {file_path}")
        return {}

# Saves a dictionary as a JSON file.
def save_json(file_path: str, data: Dict[str, Any]) -> None:
    ensure_dir(os.path.dirname(file_path))
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    logging.info(f"JSON saved to: {file_path}")
