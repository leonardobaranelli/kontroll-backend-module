import argparse
from tests.test_model import run_test
from utils.test_utils import sort_unformatted_keys

# Configure the argument parser
parser = argparse.ArgumentParser(description="Run batch tests.")
parser.add_argument('num_runs', type=int, nargs='?', default=10, help='Number of times to execute the script')
args = parser.parse_args()

# Number of times to execute the script
num_runs = args.num_runs

# Execute the main script multiple times
for i in range(num_runs):
    print(f"Running test_model.py - Iteration {i+1}/{num_runs}")
    run_test()

# Sort the unformatted_keys.txt file by the frequency of each key
sort_unformatted_keys("data/unformatted_keys.txt")
print(f"Unformatted keys sorted by frequency in data/unformatted_keys.txt.")
