# Project_scDHA
Integrating Nodejs with R

The web app where users are allowed to input single-cell RNA-seq matrix with first row as gene names and first column as cell id or select the built-in Goolam dataset of scDHA package of R.
Clustering is performed on that data using scDHA package and users are allowed to download it as png with customizable height and width.
A table is created with two columns: cell Id and Cluster No
The input data is compressed and saved as tsv file.

First of all, install node and R in your system.
If R's path is not included in the system's PATH environment variable, Please do add R to you system path.
After installing nodejs, install the R extension in your VSCode.
For Linux Ubuntu: sudo apt install nodejs npm    will install npm and also node modules folder in your project directory.
Node --version  and  npm --version to check the version of node and npm if it is installed. 
Similary install all the necessary packages/library of nodejs. Refer to package.json.

For detailed infromation about scDHA working ,please refer to its documentation at https://github.com/duct317/scDHA.
If you encounter any problem while attcahing R in your VScode, install languageserver.
install.packages("languageserver")
library(languageserver) in your R

After downloading the project, create files and images folder inside public to store file uploaded and the result.

Please do wait for a while after submitting the input as it may take a little long time for processing the input data and showing the output.


