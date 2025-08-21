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

// fs.readFile('introduction.txt','utf-8', (err,data)=>{
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

