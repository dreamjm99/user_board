
// 이게 다 프로그래밍 하면서 한글자라도 덜치려고 이새끼들이 만들어 놓은거때문에
// 진입할때 어려움이 있어..


// function test(a,b) {
//     console.log('a', a)
//     console.log('b', b)
// }

// 이건 이해되지

// 이제 애들이 function을 치기 싫어서 이렇게 만들기 시작해

// const test = (a,b) => {
//     console.log(a)
//     console.log(b)
// }

// 여기서 매개변수가 1개면 ( ) 이걸 생략가능
const test = a => {
    console.log(a)
}

// 마지막으로 함수를 리턴하는거

// const sum = (a,b) => {
//     return a+b
// }

// const sum = (a,b) => {
//     // 이게 함수안에가 1줄 이면 리턴과 괄호를 같이 없애면되
//     return a+b
// }

const sum = (a,b) => a+b

// 이렇게 화살표함수쓰는건데


// test('hello', 'world')
test('hello')

console.log(sum(1,3))

//넵
