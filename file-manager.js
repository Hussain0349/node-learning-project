import { error } from 'console'
import fs, { readdirSync, unlinkSync } from 'fs'
import chalk from 'chalk'
// content for my text file



// let content = 'iam hussain, iam from kohat and working on node.js'

//                       /* all files operation with with async    */

// fs.writeFile('introduction.text',content,{encoding: 'utf8'}, (error) =>{
//     if(err){
//         console.log(`File is not created some error caught ${error}`)
//     }
//     else {
//         console.log('File created successfully! ')
//     }
// })

// // // append new content

// let newContent = 'have 1 year of experience in react.js'

// fs.appendFile('introduction.text',newContent, function(err){
//     if(err){
//         console.log(`some error ${err} caught while updating the content `)
//     }
//     else {
//         console.log(`the following ' ${newContent} ' is added cuccessfully`)
//     }
// })


// // // read content

// fs.readFile('introduction.text','utf-8', (err,data)=>{
//     if(err){
//         console.log(`some error caught while reading the file ${err}`)
//     }
//     else{
//         console.log(data)
//     }
// })


// // // all the files in current directory

// fs.readdir('.', (err,files) => {
//     if(err){
//         console.log(`Error is caught ${err}`)
//     }
//     else {
//         console.log(`following files in current directory \n ${files}`)
//     }

// })

// // delete file

// try {
    
//     unlinkSync(filename)
//     console.log(`The file deleted sucessfully! `)

// } catch (error) {
//     console.log(`file not deleted due to some error ${error}`)
// }


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
