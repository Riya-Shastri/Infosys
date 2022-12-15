/**
 * Note: Please do not modify this file.
 * @author Shailendra Singh <ow769@cummins.com>
 */
const fs = require('fs');
const execSync = require('child_process').execSync;

if(process.env.npm_config_source === null || process.env.npm_config_source === undefined){
    console.error('Source parameter is missing in cmd. Please pass serverless package folder name like --package=<package name> as cmd line argument.')
    throw new Error("Source parameter not found in cmd"); 
}
if(process.env.npm_config_package === null || process.env.npm_config_package === undefined){
    console.error('Package parameter is missing in cmd. Please pass serverless package folder name like --package=<package name> as cmd line argument.')
    throw new Error("Package parameter not found in cmd"); 
}
//Extracting Serverless Package Folder name
const pkg = process.env.npm_config_package;
const src = process.env.npm_config_source;

//Create a directory for frontend build
const dir = 'ui-build'
const fe_dir = pkg+"/"+dir;
fs.mkdirSync(fe_dir);

execSync("cd "+pkg+" && bestzip "+dir+"/build.zip "+src,{stdio:[0, 1, 2]});