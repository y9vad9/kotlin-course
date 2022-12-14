---
description: Об'єкти на мові Kotlin
keywords: [kotlin object, kotlin singleton, туторіал, для новачків, ООП, об'єкти]
---
# Об'єкти
Щоб більше розуміти як працюють об'єкти у програмуванні, введім приклад з реального життя,
наприклад, у вас є домашній вихованець.
Нехай це буде кіт. 

Розглянемо його як об'єкт. У нього є назва (тобто його ідентифікатор серед
інших вихованців), є якісь властивості (наприклад, його ім'я та вік) та є
функції (наприклад, нявкання).

Візуалізуймо нашого кота:
![Кіт](images/cat_object_stage_1.png#invert)

## Властивості
Властивість, грубо кажучи, це те саме, що й змінна, тільки вона прив'язана до
об'єкта.

## Функції
Раніше ми розглядали, що таке функції. Єдине, що відрізняється у
такому випадку - це те, що нам потрібен об'єкт (його екземпляр) щоб її викликати.

:::info Інформація
Важливо враховувати, що область видимості змінної та/або функції обмежується об'єктом. Тобто,
її видно тільки, якщо в нас є доступ до об'єкта
та сам член (функція або змінна) має відповідний модифікатор видимості.
:::

Зобразім же нашого кота нарешті на Kotlin.

## Kotlin
Для того, щоб створити об'єкт в Kotlin, ми використовуємо ключове слово `object`:
```kotlin
object Cat
```
Наступним же словом, ми вказуємо назву об'єкта. До речі, назва об'єктів ми завжди пишемо з великої букви 
(тобто замість lower camel case, у нас використовується __upper camel case__).

Далі, йде тіло об'єкта:
```kotlin
object Cat { // вказуємо тіло об'єкта
    // тут будуть речі, які відносяться до об'єкта
}
```

Вкажім властивості нашому об'єкту:
```kotlin
object Cat {
    val name: String
    val age: Int
}
```
Ми вказали властивості, але не задали туди ніяких даних, через що наша IDE та компілятор буде сваритись. Виправимо:
```kotlin
object Cat {
    val name: String = "Мася"
    val age: Int = 4
}
```
Вказування властивостей ніяк не відрізняється від будь-якого іншого місця. І до речі, теж саме з функціями:
```kotlin
object Cat {
    val name: String = "Мася"
    val age: Int = 4
    
    fun meow(): String {
        return "meow<3"
    }
}
```
І на цьому етапі у нас вже конструювання об'єкту закінчене. Для того, щоб отримати щось з цього об'єкту робимо наступне:
```kotlin
fun main() {
    println("Кіт ${Cat.name} віком ${Cat.age} сказав ${Cat.meow()}.")
}
```
Не складно, чи не так?
:::info Додатково
Чому в цьому випадку ми використовуємо `${}` для змінних? Все просто – `Cat.name` та ін. сприймається, як вираз, бо
перша частина (`Cat`) не є змінною.
:::
:::tip Потрібно знати
Ви пам'ятаєте про [області видимості](/kotlin/basics/scope-visibility.md)? Об'єкти також мають свою область видимості, 
але вона трішки відрізняється: члени об'єкта (функції та властивості) доступні, якщо сам об'єкт доступний.

Ось таке не буде працювати
```kotlin title="AnotherFile.kt" {1}
private object Cat {
    val name: String = "Мася"
    val age: Int = 4
    
    fun meow(): String {
        return "meow<3"
    }
}
```
```kotlin title="Main.kt"
fun main() {
    // This will error
    println("Кіт ${Cat.name} віком ${Cat.age} сказав ${Cat.meow()}.") // Cat не доступний
}
```
Також не буде працювати, якщо сам член об'єкта буде private:
```kotlin {3}
object Cat {
    // змінна є приватною та доступна тільки в місці створення та нижче по ієрархії.
    private val name: String = "Мася" 
    val age: Int = 4
    
    fun meow(): String {
        return "meow<3"
    }
}
```
```kotlin
fun main() {
    // This will error
    println("Кіт ${Cat.name} віком ${Cat.age} сказав ${Cat.meow()}.") // Помилка: Cannot access 'name': it is private in 'Cat'
}
```
:::
До речі, а що робити, якщо у нас декілька котів? Розберемо в наступній темі.


