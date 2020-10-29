#!/usr/bin/env sh

echo "开始编译"

npm i

cd packages/core

npm i

echo "编译 core"
npm run build

cd ../vue

npm i

echo "编译 yform/vue"
npm run compile:vue

echo "编译 yform/vue element-ui 适配版"
npm run compile:element-ui

rm -f package-lock.json

read -p "编译完成，是否要发包?(y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "开始发包"
  lerna publish

  echo "准备上传到阿里云oss"
  node aliyun-oss.js

else
  echo "流程结束"
fi

