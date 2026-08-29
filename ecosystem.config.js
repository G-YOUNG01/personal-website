module.exports = {
  apps: [
    {
      name: "personal-website",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "fork", // 必须 fork，SQLite 单进程写入
      instances: 1,
      cwd: "/var/www/personal-website",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
