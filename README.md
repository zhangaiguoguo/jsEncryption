# jsEncryption
jsEncryption js加密

-nofunc 指令是指不进行加密的js [-nofunc=文件名称,文件名称]

-jo 指令 全局不加密，只去掉换行，空格 [-jo]

-mfy 指令是指对某一个文件只进行去掉换行，空格 不进行混淆/加密 [-mfy=文件名称,文件名称]

-p 对要加密/混淆的文件路径 [-p=../dist] 默认为当前的文件 要符合path.resolve的规范

-isER 当执行代码中报错时是否恢复以加密/混淆的文件
