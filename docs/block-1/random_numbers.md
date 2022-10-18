---
id: random_numbers
---
# Випадковість в Kotlin
Я думаю ви багато разів зустрічались з поняттям «випадковості». 
Була це лотерея, чи енеки-бенеки – неважливо. 
Наше життя постійно спіткає та чи інша випадковість. Розгляньмо, як випадковість працює в Kotlin.

## Random
Говорячи про випадковість в Kotlin, будь-який Kotlin-розробник відразу згадає `kotlin.random`
пакет, який вбудований в Kotlin.

За допомогою нього ви можете:
- генерувати випадкові числа: цілі (`Int`, `Long`) та з плаваючою точкою (`Float`, `Double`)
- генерувати випадковий логічний тип `Boolean`

:::tip Не завадить знати
Також, `kotlin.random` може генерувати байти та біти, але ми ці типи ще не розглядали.
:::

Перейдім до більш практичної частини. **Як це все робиться?**

Щоб отримати випадкове ціле число, ми можемо використати функцію `Random.nextInt(from, until)`:
```kotlin title="Main.kt"
import kotlin.random.Random

fun main() {
    println(Random.nextInt(0, 9))
}
```
Виведе:
```text title="Console"
8
```
Тобто, випадковість обмежена від 0 до 9. 
:::caution Увага
Можуть бути будь-які цифри, головне – не переплутати
'від' з 'до' і не зробити наступне `Random.nextInt(9, 0)`. Буде помилка!
:::
За аналогією працюють і інші функції:
```kotlin title="Main.kt"
import kotlin.random.Random

 fun main() {
    println(Random.nextInt(0, 9))
     // highlight-next-line
    println(Random.nextLong(1L, 1000000L))
     // highlight-next-line
    println(Random.nextDouble(1.9, 9.9))
     // highlight-next-line
    println(Random.nextBoolean()) 
}
```
Виведе приблизно таке:
```text title="Console"
2
386039
7.176104912683028
false
```
Вирішім наступне завдання:
:::info Завдання №1
Користувач вводить число від 1 до 30 (перевірте число). Зробіть програму, що буде
вгадувати число користувача та друкувати скільки спроб знадобилось, щоб вгадати вказане число.
:::
Спочатку отримаємо число та перевіримо його:
```kotlin {2-6}
fun main() {
    val number = readln().toInt()
    if(number < 0 || number > 30) {
        println("Число має бути в діапазоні між 1 та 30.")
        return // виходимо з функції
    }
}
```
Тепер для того, щоб вгадати число ми можемо скористатись циклічним оператором `while`

```kotlin {1,10-16}
import kotlin.random.Random // додаємо до нашого простору імен тип Random

fun main() {
    val number = readln().toInt()
    if (number < 0 || number > 30) {
        println("Число має бути в діапазоні між 1 та 30.")
        return // виходимо з функції
    }

    var attempt = 0 // робимо змінну, щоб зберігати кількість спроб
    while (true) {
        if (Random.nextInt(0, 30)) {
            println("Число було знайдено за $number") // робимо конкатенацію
            break // виходимо з циклу
        }
        attempt++ // додаємо 1 до attempt
    }
}
```
:::tip Цікаво знати
Якесь незрозуміле `attempt++`, чи не так? Насправді це просто спрощення для
`attempt = attempt + 1`. Воно також існує і в інший бік: `attempt--`.

До речі, така операція має два види:
- префіксний інкеремент / декремент
- постфіксний інкремент / декремент

В нашому випадку, це постфіксний інкремент. Але чим вони відрізняються?

Префіксний інкремент спочатку додає, а потім повертає значення з виразу, а постфіксний
інкремент спочатку віддає значення, а потім додає один. Тобто:
```kotlin
var x = 0
println(x++) // виведе 0
println(x) // тільки тут він виведе 1

var y = 0
println(++y) // виведе 1
```
:::
І ми розв'язали цю нескладну задачу.

[//]: # (## SecureRandom)

[//]: # (Ми поговорили про звичайний Random, тепер же поговоримо про більш безпечнішу випадковість.)

[//]: # (Чому звичайна випадковість не є безпечною? Щоб не вдаватись в математику, скажу просто –)

[//]: # (алгоритм отримання є «передбачуваним». Тобто, знаючи, як працює алгоритм, ви можете)

[//]: # (передбачити наступне число.)

[//]: # ()
[//]: # (І тут нам на допомогу приходить «безпечний» варіант випадковості.)

[//]: # (Чому ця випадковість є безпечною, а попередня ні? Все просто: SecureRandom )

[//]: # (використовує випадкові дані з операційної системи. Які саме? Наприклад, може брати)

[//]: # (дані поведінки користувача &#40;рух миші та ін.&#41;, які завжди є унікальними. )

[//]: # (Також SecureRandom використовує більш надійний алгоритм генерації випадкових чисел.)

[//]: # ()
[//]: # (:::tip Дізнатись більше)

[//]: # (Якщо зацікавлені в цій темі, можете прочитати )

[//]: # ([цю відповідь]&#40;https://stackoverflow.com/a/11052736/11849017&#41; на stackoverflow.)

[//]: # (:::)

[//]: # (За назвами функції не відрізняються, але за параметрами – так.)

[//]: # (Але, ми можемо зкористатись функцією `asKotlinRandom&#40;&#41;`, )

[//]: # (щоб мати такі ж самі функції, як і у попереднього Random.)

[//]: # ()
[//]: # (```kotlin title="Main.kt")

[//]: # (import java.security.SecureRandom // SecureRandom не є частиною Kotlin, але є на платформі Java.)

[//]: # (import kotlin.random.Random)

[//]: # (import kotlin.random.asKotlinRandom)

[//]: # ()
[//]: # (fun main&#40;&#41; {)

[//]: # (    val random: Random = SecureRandom&#40;&#41;.asKotlinRandom&#40;&#41;)

[//]: # (    println&#40;random.nextInt&#40;1, 9&#41;&#41;)

[//]: # (})

[//]: # (```)

[//]: # (:::info Інформація)

[//]: # (Як ви вже бачите, ми отримуємо SecureRandom за допомогою функції `SecureRandom&#40;&#41;`)

[//]: # (&#40;насправді, це не зовсім так, але поки так залишимо&#41;, яка повертає нам тип даних від імені якого)

[//]: # (ми вже можемо робити операції.)

[//]: # (:::)

