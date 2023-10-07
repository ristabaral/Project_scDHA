options(repos = c(CRAN = "https://cloud.r-project.org/"))
if (!requireNamespace("scDHA", quietly = TRUE)) {
  install.packages("scDHA")
 }
library(scDHA)


#checking whether the Rscript is called or not
# Read the selected dataset from Node.js
args <- commandArgs(trailingOnly = TRUE)
#whether file is received or not
if (length(args) == 0) {
  cat("Error: No data file provided.\n")
  quit("no data")
}
file_path <- args[1]
if (grepl("\\.tsv$", file_path)) {
  data <- read.table(file_path, header = TRUE, sep = "\t")
  if (!is.matrix(data)) {
    data <- as.matrix(data)
  }
} else if (grepl("\\.rda$", file_path)) {
  # Load data from an RDA file i.e from goolam dataset
  load(file_path)
  objects_in_workspace <- ls()
  if ("Goolam" %in% objects_in_workspace) {
    dataset <- Goolam
    data <- t(Goolam$data)
  }
}
data <- log2(data + 1)
#dimension reduction of input data
compressed_data <- scDHA(data, method = "scDHA",
                         sparse = FALSE, gen_fil = TRUE, do.clus = FALSE,
                         sample.prob = NULL, seed = NULL)
latent <- compressed_data$all.latent
write.table(latent, "public/images/latentdata.tsv", sep = "\t")
#For clustering of the input data
result <- scompressed_data <- scDHA(data, method = "scDHA", sparse = FALSE,
                                    gen_fil = TRUE, do.clus = TRUE,
                                    sample.prob = NULL, seed = NULL)
cluster <- result$cluster
result <- scDHA.vis(result, seed = 1)
png("./public/images/myplot.png")
plot(result$pred, col = factor(cluster), xlab = "scDHA1", ylab = "scDHA2")
legend("topright", legend = levels(factor(cluster)),
       col = 1:length(levels(factor(cluster))),
       pch = 1:length(levels(factor(cluster))))
cat("myplot.png")
row <-  rownames(data)
mytable <- data.frame(Cell_Id = row, Cluster_No = cluster)
write.table(mytable, "./public/images/my_table.tsv",
            sep = "\t", row.names = FALSE)

dev.off()