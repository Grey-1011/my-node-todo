import { db } from './db.js';

import inquirer from 'inquirer';



// --- cli ---

const add = async (title) => {
  // 读取之前的 task
  const list = await db.read()
  // console.log(list)
  // 往里面 push 一个 task 
  list.push({ title, done: false })
  // 存储 task 到 文件
  await db.write(list)
}

const clear = async () => {
  // 直接写入一个空数组的字符串
  await db.write([])
}

const showAll = async () => {
  const list = await db.read()
  // list.forEach((task, index) => {
  // console.log(`${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`) )}

  // --- inquirer ---

  // printTasks 
  printTasks(list)

}

const printTasks = (list) => {
  // 打印之前的 tasks
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: 'Select a task',
        choices: [{ name: 'Exit', value: '-1' }, ...list.map((task, index) => {
          return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString(), short: task.title }
        }), { name: 'Create task', value: '-2' }],
      },
    ])
    .then((answers) => {
      const index = parseInt(answers.index)
      if (index >= 0) {
        // askForAction
        askForAction(list, index)
      } else if (index === -2) {
        // 询问创建 task
        askForCreateTask(list)
      }
    });
}

const markAsDone = (list, index) => {
  list[index].done = true;
  db.write(list);
}

const markAsUndone = (list, index) => {
  list[index].done = false;
  db.write(list)
}

const updateTitle = (list, index) => {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: 'Type a new title',
    default: list[index].title // 之前的标题，用 default
  }).then((answers) => {
    list[index].title = answers.title;
    db.write(list)
  });
}

const remove = (list, index) => {
  list.splice(index, 1)
  db.write(list)
}

const askForAction = (list, index) => {
  const actions = {
    markAsDone: markAsDone,
    markAsUndone,
    updateTitle,
    remove
  }
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an operation',
      choices: [
        { name: 'Exit', value: 'quit' },
        { name: 'Done', value: 'markAsDone' },
        { name: 'Undone', value: 'markAsUndone' },
        { name: 'UpdateTitle', value: 'updateTitle' },
        { name: 'Remove', value: 'remove' }
      ]
    }
  ]).then((answer) => {
    // 如果 actions 里面有 answer.action ,也就是有 choices 里的 value， 就执行 value 对应的函数
    const action = actions[answer.action]
    action && action(list, index)
  })
}

const askForCreateTask = (list) => {
  inquirer.prompt({
    type: 'input',
    name: 'taskName',
    message: 'Enter new task name'
  }).then((answers) => {
    list.push({
      title: answers.taskName,
      done: false
    })
    db.write(list)
  })
}

export { add, clear, showAll }