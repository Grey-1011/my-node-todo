import { readFile, writeFile } from 'fs';
import { homedir } from 'os';
const userHomeDir = homedir();
const home = process.env.HOME || userHomeDir;
import path from 'path';
const dbPath = path.join(home, '.todo')

// read 函数如何返回呢？ 因为这是一个 异步函数, 不能 return，只能在成功的时候才能 resolve
// return list 这里 return 的话，只是 return 了里面的箭头函数，管不到 read
// 两个解决方法，1.使用 callback  2.使用 promise

const db =  {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      readFile(path, { flag: 'a+' }, (err, data) => {
        // 如果有错，直接 return ,就不用写 else 了
        if (err) { return reject(err); }
        let list;
        try {
          list = JSON.parse(data.toString())
        } catch (err2) {
          list = []
        }
        resolve(list);
      }
      )
    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      writeFile(path, string, (err) => {
        if (err) { return reject(err); }
        resolve('The file has been saved!')
      })
    })
  }
}

export { db }

