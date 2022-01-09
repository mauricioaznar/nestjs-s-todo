#!/bin/sh

cd ../
npm run postgre:docker:migrate
npm rum start:docker
