const { minify } = require("terser");
const JavascriptObfuscator = require("javascript-obfuscator");
var path = require("path");
const fs = require("fs");
const tasks = [];
const runTasks = [];
let taskNum = 0;
const formatO = "utf-8";
const currentFileName = (process.argv[1] + ".js");
const JOKEY = "-jo";
const NOFUNCKEY = "-nofunc=";
const MINIFYKEY = "-mfy=";
const ISERRORRECOVER = "-isER";

const isErrorRecover = process.argv.some(i => i === ISERRORRECOVER);
const jxStr = (k) => ((process.argv.find(i => i.startsWith(k)) || "").split("=").slice(1)[0] || "").split(",");
const NOJavascriptObfuscator = jxStr(MINIFYKEY);
const NOFUNCKEYList = jxStr(NOFUNCKEY);
const NOJavascriptObfuscatorSW = (v) => NOJavascriptObfuscator.some(i => v.startsWith(i));
const setTaskNum = (r) => {
    r ? taskNum++ : taskNum--;
    if (!r && !taskNum) {
    }
};

function runTask() {
    for (let w in tasks) {
        if (!tasks[w].status) {
            runTaskMinify(tasks[w]).then();
        }
    }
}

async function runTaskMinify(row) {
    if (row) {
        row.status = true;
        const fsValue = fs.readFileSync(row.path, formatO);
        runTasks.push({
            ...row,
            status: false,
            value: fsValue,
        });
        const result = await minify(fsValue, {
            mangle: true,
        });
        fs.writeFileSync(row.path, !NOJavascriptObfuscatorSW(row.p) && process.argv.some(i => i === JOKEY) ? (JavascriptObfuscator.obfuscate(result.code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
        }).getObfuscatedCode()) : result.code, formatO);
        const findIndex = tasks.findIndex((i) => i === row);
        tasks.splice(findIndex, 1);
        console.log(row.path, "文件已压缩");
        // throw new Error("111");
    }
}

function readdirHandler(pathName, hList = []) {
    fs.readdir(pathName, function(err, files) {
        for (let i in files) {
            if (hList.some(f => files[i].startsWith(f))) continue;
            fs.stat(path.join(pathName, files[i]), function(err, data) {
                if (data.isDirectory()) {
                    readdirHandler(path.resolve(pathName, files[i]), hList);
                } else if (data.isFile() && /.*(.js)$/.test(files[i]) && (pathName + "\\" + files[i]) !== currentFileName) {
                    tasks.push({ path: path.resolve(pathName, files[i]), status: false, p: files[i] });
                }
                runTask();
            });
        }
    });
}

readdirHandler(path.resolve(__dirname, (jxStr("-p=")[0] || __dirname)), NOFUNCKEYList);

// process.nextTick(() => {
//     console.debug("所有文件已加载完毕");
// });

function runTask2() {
    for (let w of runTasks) {
        runTaskItem(w);
    }
}

function runTaskItem(row) {
    if (row && !row.status) {
        row.status = true;
        fs.writeFileSync(row.path, row.value, formatO);
        runTasks.splice(runTasks.findIndex(i => i === row), 1);
    }
}

process.on("uncaughtException", (err) => {
    isErrorRecover && runTask2();
    console.error(err);
    // 在这里你可以执行一些自定义的错误处理操作
    // 但请注意，这里的异常处理只能用于紧急情况，不能代替良好的错误处理实践
});
// 你的其他 Node.js 代码继续写在这里