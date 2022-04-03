<template>
  <router-view/>
</template>
<script lang="ts" setup>
//定义一个数组
const arr = [12, 2, 3, 45, 5, 6, 7, 85, 9, 55]

//冒泡排序
function bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

//选择排序
function selectSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let min = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j
      }
    }
    if (min !== i) {
      let temp = arr[i]
      arr[i] = arr[min]
      arr[min] = temp
    }
  }
  return arr
}

//插入排序
function insertSort(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = temp
  }
  return arr
}

//希尔排序
function shellSort(arr: number[]) {
  let gap = Math.floor(arr.length / 2)
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i]
      let j = i - gap
      while (j >= 0 && arr[j] > temp) {
        arr[j + gap] = arr[j]
        j -= gap
      }
      arr[j + gap] = temp
    }
    gap = Math.floor(gap / 2)
  }
  return arr
}

//归并排序
function mergeSort(arr: number[]): (number | undefined)[] {
  if (arr.length <= 1) {
    return arr
  }
  let middle = Math.floor(arr.length / 2)
  let left = arr.slice(0, middle)
  let right = arr.slice(middle)
  return merge(mergeSort(left) as number[], mergeSort(right) as number[])
}

function merge(left: number[], right: number[]): (number | undefined)[] {
  let result = []
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while (left.length) {
    result.push(left.shift())
  }
  while (right.length) {
    result.push(right.shift())
  }
  return result
}

//快速排序
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr
  }
  let pivotIndex = Math.floor(arr.length / 2)
  let pivot = arr.splice(pivotIndex, 1)[0]
  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

//定义一个二维数组
const arr2 = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
]

//二维数组转一维数组
function twoDimensionalArrayToOneDimensionalArray(arr: number[][]) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      result.push(arr[i][j])
    }
  }
  return result
}

//一维数组转二维数组
function oneDimensionalArrayToTwoDimensionalArray(arr: number[], row: number, column: number) {
  let result = []
  for (let i = 0; i < row; i++) {
    let temp = []
    for (let j = 0; j < column; j++) {
      temp.push(arr.shift())
    }
    result.push(temp)
  }
  return result
}

//返回单个字母在字符串中出现位置的数组
function findPositionOfSingleLetter(str: string, letter: string) {
  let result = []
  for (let i = 0; i < str.length; i++) {
    if (str[i] === letter) {
      result.push(i)
    }
  }
  return result
}

console.log(findPositionOfSingleLetter('hello', 'l'))

//讲字符串中出现的特定字符串替换成另一个字符串
function replaceString(str: string, oldStr: string, newStr: string) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    if (str.slice(i, i + oldStr.length) === oldStr) {
      result += newStr
      i += oldStr.length - 1
    } else {
      result += str[i]
    }
  }
  return result
}

//校验邮箱合法性
function emailRegular(email: string) {
  return true
}

</script>