
let filename = process.argv[2]
let text = process.argv[3]


// modified for writing and creating the files using argv
try {
    fs.writeFileSync(filename,text)
    console.log(chalk.green('file create successfully! '))
} catch (error) {
    console.log(chalk.yellow(`some error caught while creating file.. ${error}`))
}

// read file

try {
    let data = fs.readFileSync(filename,'utf-8')
    console.log(chalk.green(data))
} catch (error) {
    console.log(chalk.red(`some error caught while reading the file ${error}`))
}

// // append some content

// // iam using the same content i have used before for appending it in file
// // stored in variable newContent

try {
    
    fs.appendFileSync(filename,text)
    console.log(chalk.green(`followiing content ' ${text} ' added sucessfully! `))

} catch (error) {

    console.log(chalk.red(`some error caught while appending tthe content ${error}`))
    
}

// // all the files

try {
    
    let allFiles = readdirSync('.')
    console.log(chalk.green(`All the files in current dierctor: ${allFiles}`))

} catch (error) {
    console.log(chalk.red(`Error caught ${error}`))
}
