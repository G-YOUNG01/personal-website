import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("请输入管理员密码: ", (password) => {
  const hash = bcrypt.hashSync(password, 10);
  console.log("\n生成的密码哈希（填入 .env 的 ADMIN_PASSWORD_HASH）:");
  console.log(hash);
  rl.close();
});
