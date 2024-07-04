# dna-editor README

A simple DNA editor and plotter for convenient DNA sequence design. 

## Features

1. MFE sequence plotter (built on top of ViennaRNA python API)
    Plots the minium free energy sequence of a given DNA strand
2. GC-content Calculation
3. Sequence length calculation
4. Random sequence generation
    Generate a DNA random sequence of specified length with 50% GC content
5. Highlighting (built using existing extension)
6. Underlining

Keybinds:

1. alt + shift + p
2. alt + shift + g
3. alt + shift + l
4. alt + shift + s
5. alt + shift + h (ctrl + alt + shift + h for un-highlighting)
6. alt + shift + u (ctrl + alt + shift + h for un-underlining)

## Citations

Vienna RNA:
Ronny Lorenz, Stephan H. Bernhart, Christian Höner zu Siederdissen, Hakim Tafer, Christoph Flamm, Peter F. Stadler, and Ivo L. Hofacker. ViennaRNA package 2.0. Algorithms for Molecular Biology, 6(1):26, 2011. doi:10.1186/1748-7188-6-26.

I.L. Hofacker, W. Fontana, P.F. Stadler, L.S. Bonhoeffer, M. Tacker, and P. Schuster. Fast folding and comparison of RNA secondary structures. Monatshefte für Chemie/Chemical Monthly, 125(2):167–188, 1994. URL: https://www.academia.edu/download/48689421/Fast_Folding_and_Comparison_of_RNA_Secon20160908-13624-1yg70az.pdf.

## Requirements

You need to install the ViennaRNA python API for the plotting to work. 
https://www.tbi.univie.ac.at/RNA/ViennaRNA/doc/html/api_python.html

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

**Enjoy!**
