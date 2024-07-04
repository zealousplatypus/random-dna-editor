import sys
import subprocess
import os
import RNA
from RNA import RNA
import tempfile

RNA.params_load_DNA_Mathews2004()

def run_viennaRNA(sequence):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.ps') as temp_file:
        ps_file = temp_file.name

    try:
        # Generate ps file
        fc = RNA.fold_compound(sequence)
        (ss, mfe) = fc.mfe()
        RNA.PS_rna_plot(sequence, ss, ps_file)

        # Display ps file using a PDF viewer
        subprocess.run(['evince', ps_file], check=True)

    except Exception as e:
        print(f"Error generating or displaying plot: {e}")
    finally:
        # Clean up temporary file
        if os.path.exists(ps_file):
            os.remove(ps_file)

def main(sequence):
    run_viennaRNA(sequence)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_plot.py <sequence>")
        sys.exit(1)

    dna_sequence = sys.argv[1]
    main(dna_sequence)

"""
Trying to generate reliability plot.
It works as a script but doesn't play nice with vscode.
"""
# import subprocess
# import os
# import sys
# import tempfile

# def run_viennaRNA(sequence):
#     with tempfile.TemporaryDirectory() as tmpdirname:
#         file_name = 'zane_test'
#         seq_file = os.path.join(tmpdirname, f'{file_name}.seq')
#         dp_ps_file = f"{file_name}_sequence_dp.ps"
#         ss_ps_file = f"{file_name}_sequence_ss.ps"
#         rss_ps_file = f"{file_name}_sequence_rss.ps"
        
#         # Write the DNA sequence to a file
#         with open(seq_file, 'w') as f:
#             f.write(f">{file_name}_sequence\n{sequence}")

#         print(f"Sequence file: {seq_file}")

#         try:
#             # Run RNAfold with the -p option and DNA parameters
#             print(f"Running RNAfold on {seq_file} with DNA parameters")
#             subprocess.run(['RNAfold', '-p', '--paramFile=DNA', seq_file], check=True)

#             cwd = os.getcwd()
#             # Check if the expected files exist in the temporary directory
#             print(f"Checking for files in temporary directory: {dp_ps_file}, {ss_ps_file}")
#             temp_dp_ps_exists = os.path.exists(dp_ps_file)
#             temp_ss_ps_exists = os.path.exists(ss_ps_file)
#             print(f"Temporary directory - dp_ps exists: {temp_dp_ps_exists}, ss_ps exists: {temp_ss_ps_exists}")

#             # Check if the expected files exist in the current working directory
#             dp_ps_file_cwd = os.path.join(cwd, 'zane_test_sequence_dp.ps')
#             ss_ps_file_cwd = os.path.join(cwd, 'zane_test_sequence_ss.ps')
#             print(f"Checking for files in current working directory: {dp_ps_file_cwd}, {ss_ps_file_cwd}")
#             cwd_dp_ps_exists = os.path.exists(dp_ps_file_cwd)
#             cwd_ss_ps_exists = os.path.exists(ss_ps_file_cwd)
#             print(f"Current working directory - dp_ps exists: {cwd_dp_ps_exists}, ss_ps exists: {cwd_ss_ps_exists}")

#             # Check if the expected files exist
#             if not (os.path.exists(dp_ps_file) and os.path.exists(ss_ps_file)):
#                 raise FileNotFoundError(f"Expected .ps files not found: {dp_ps_file}, {ss_ps_file}")
            
#             print(f"Expected files found: {dp_ps_file}, {ss_ps_file}")

#             # Generate the reliability plot
#             relplot_command = f"/Users/zanechan/ViennaRNA-2.6.4/src/Utils/relplot.pl {ss_ps_file} {dp_ps_file} > {rss_ps_file}"
#             print(f"Running reliability plot command: {relplot_command}")
#             subprocess.run(relplot_command, shell=True, check=True)

#             # Open the reliability plot with evince
#             print(f"Opening plot with evince: {rss_ps_file}")
#             subprocess.run(['evince', rss_ps_file], check=True)

#         finally:
#             # Clean up all generated files
#             files_to_delete = [seq_file, dp_ps_file, ss_ps_file, rss_ps_file]
#             for file in files_to_delete:
#                 if os.path.exists(file):
#                     os.remove(file)

# def main(sequence):
#     run_viennaRNA(sequence)

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print("Incorrect usage. Shuould be python generate_plot.py <sequence>")
#         sys.exit(1)

#     dna_sequence = sys.argv[1]
#     main(dna_sequence)
#     # main('CTAGGACGCTCCAAGTTACCCAGTA')