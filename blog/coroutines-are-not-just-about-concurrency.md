---
title: Coroutines are not just about concurrency
authors: vadim-yaroschuk
keywords: [kotlin, kotlin coroutines, kotlin suspend, kotlin continuation, coroutine context, kotlin sequences]
tags: [kotlin, coroutines, compiler]
date: 2023-09-01
---
# Coroutines are not just about concurrency
Every time you hear about Kotlin Coroutines, you probably think about an easy, concise, and performant solution for handling asynchronous tasks like, for example, network requests. But is that their _only purpose_? Let's consider the usages of Kotlin Coroutines beyond concurrency.

## Kotlin Coroutines Primitives
Let's start by understanding, how Coroutines underlying mechanism works. If we take a look at Kotlin Coroutines Primitives, it's only about a few classes and functions:
- `Continuation`
- `CoroutineContext`
- `suspendCoroutine`
- `createCoroutine`
- `startCoroutine`

That's all that we have in our `kotlin-stdlib`. But what are they used for? Let's dive deeper into how Kotlin Coroutines are designed to work.
### `Continuation`
Continuation is just an interface with two members: `context` and `resumeWith`:
```kotlin
public interface Continuation<in T> {
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```
What does it do and what its purpose? `Continuation` – is literally _Coroutine_ in primary. It's like a buffed callback with ability to propagate additional information and provide useful result of execution to coroutine.

We haven't talked about `CoroutineContext` yet, let's consider only `resumeWith` for now.

### `resumeWith`
Like any other callback, this is a function that is called when coroutine finishes its work. It uses `kotlin.Result` to propagate any exceptions that occur inside coroutine in a safe way. 

So, we can literally create our concurrency logic using `Continuation` in the next way:
```kotlin
suspend fun executeNetworkRequest(): String = 
	suspendCoroutine { continuation ->
		thread {
			continuation.resumeWith(someBlockingRequest())
		}
	}
```
> `suspendCoroutine` – is a bridge between kotlin coroutines code and non-coroutine-based code.

Or use existing asynchronous (pseudo-code):
```kotlin
suspend fun executeNetworkRequest(): String =
	suspendCoroutine { continuation ->
		apiService.getSomething()
			// onSuccess & onFailure is a callback
			.onSuccess(continuation::resume)
			.onFailure(continuation::resumeWithException)
			.executeAsync()
	}
```
> `Continuation<in T>.resume(..)` is the extension to avoid passing `kotlin.Result` every time.

So, we can not only implement our concurrency logic but use existing and make it work with Kotlin Coroutines.

### `startCoroutine`
Also, we can start suspend functions from non-suspend contexts using `startCoroutine`. In Kotlin it's always used in the end if your `main` function is `suspend`.

> `kotlinx.coroutines` also uses it to run coroutines, but the mechanism there is much harder, of course.

```kotlin
import kotlin.coroutines.*

fun main() {
	val operation: suspend () -> Unit = ::a
	operation.startCoroutine(
		object : Continuation<Unit> {
			// we will talk about it lower
			override val coroutineContext = EmptyCoroutineContext
			
			// called when coroutine finished its work
			override fun resumeWith(result: Result<Unit>) {
				println(
					if(result.isSuccess) 
						"Successfully done" 
					else "Error happenned: ${result.exceptionOrNull()}"
				)
			}
		}
	)
}

suspend fun a() {...}
```
> But, of course, you can't just call suspend functions from `kotlinx.coroutines` when executing coroutines in such way.

### `CoroutineContext`
Now we came to another member of `Continuation` – `CoroutineContext`. What is it for?

In programming, we often handle multiple tasks at once, and managing them efficiently can be challenging. Kotlin's `CoroutineContext` helps address this challenge. It's a provider that propagates needed data to the coroutine. In the real world, it's usually about passing parameters across complex chain of coroutines.
> To be more clear, CoroutineContext in `kotlinx.coroutines` stands for [structured concurrency](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency).

#### Simple example
Let's create from our previous example for `startCoroutine` code with the ability to retrieve values from `CoroutineContext`:
```kotlin
import kotlin.coroutines.*

// define our container for data we need inside coroutine
// it should always inherit 'CoroutineContext.Element'
data class ExecutionContext(val someInt: Int) : CoroutineContext.Element {
    override val key = EXECUTION_CONTEXT_KEY
}

// define type-safe key using which we will get our value
val EXECUTION_CONTEXT_KEY = object : CoroutineContext.Key<ExecutionContext> {}

// define coroutine context that we will pass into Continuation
private val myCoroutineContext = object : CoroutineContext {
	private val values = mapOf<CoroutineContext.Key<*>, CoroutineContext.Element>(
        EXECUTION_CONTEXT_KEY to ExecutionContext(10000)
    )

	override operator fun <E : CoroutineContext.Element> get(key: CoroutineContext.Key<E>): E? {
		return values[key] as? E
	}

	// .. we omit other functions for simplicity
}

suspend fun a() {
	// here we retrieve value from coroutine context
	// coroutineContext is compiler intrinsic, can be called
	// only from suspend world
	val executionContext = coroutineContext[EXECUTION_CONTEXT_KEY]!!
	println(executionContext.someInt!!)
}

fun main() {
	val operation: suspend () -> Unit = ::a
	operation.startCoroutine(
		object : Continuation<Unit> {
			override val context: CoroutineContext = myCoroutineContext
			
			override fun resumeWith(result: Result<Unit>) {
				println(
					if(result.isSuccess) 
						"Successfully done" 
					else "Error happenned: ${result.exceptionOrNull()}"
				)
			}
		}
	)
}
```

> `CoroutineContext.Element` – is the abstract that is used for storing elements inside `CoroutineContext`
>
> `CoroutineContext.Key` – is the identifier of `CoroutineContext.Element`. 

You can play around with this code [here](https://pl.kotl.in/0AZBcZ4MM).
#### Real-project example

Let's imagine that we have our API service. Usually, we need to have some layer of authorization, so let's consider next example (as for such, I took gRPC):
```kotlin
// let's define an element that will persist in `CoroutineContext`
data class AuthorizationContext(
    val accessHash: String?,
    val provider: AuthorizationProvider,
) : CoroutineContext.Element {
    companion object Key : CoroutineContext.Key<AuthorizationContext>

    override val key: CoroutineContext.Key<*> = Key
}

// now we define our interceptor
class AuthorizationInterceptor(
    private val authorizationProvider: AuthorizationProvider,
) : CoroutineContextServerInterceptor() {
    companion object {
        private val ACCESS_TOKEN_METADATA_KEY: Metadata.Key<String> =
            Metadata.Key.of("access-token", Metadata.ASCII_STRING_MARSHALLER)
    }

    override fun coroutineContext(call: ServerCall<*, *>, headers: Metadata): CoroutineContext {
        return AuthorizationContext(
            accessHash = headers.get(ACCESS_TOKEN_METADATA_KEY),
            provider = authorizationProvider,
        )
    }
}
```

`CoroutineContext` in `kotlinx.coroutines` is literally just a `Map<K : CoroutineContext.Key, V : CoroutineContext.Element>` (to be more accurate, it's [ConcurrentHashMap](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html) on JVM, for example), same as it was in our example above. But, if we talk about `kotlinx.coroutines`, it's propagated to all children coroutines within the desired coroutine (we didn't have such a mechanism).

So, now we can get it in children coroutines:
```kotlin
suspend inline fun provideAuthorization(block: (UserId) -> Unit) {
	val authContext = coroutineContext[AuthorizationContext]
	authContext.accessHash ?: throw StatusException(Status.UNAUTHORIZED)
	
	val userId = authContext.provider.provide(authContext.accessHash)
	return block(userId)
}
```

> Interesting fact: [coroutineContext](https://github.com/JetBrains/kotlin/blob/7a7d392b3470b38d42f80c896b7270678d0f95c3/libraries/stdlib/src/kotlin/coroutines/Continuation.kt#L157) is the only property in Kotlin that has `suspend` modifier. 👀

For gRPC, we also need to register our Interceptor and write our RPCs. But the idea of this solution for gRPC is simple – decouple logic and simplify developer experience. 

> For Java, gRPC uses [ThreadLocal](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html), so we can also consider `CoroutineContext` as an alternative to `ThreadLocal`. We cannot use `ThreadLocal` within coroutines, because usually coroutine is not linked to a specific thread (especially, when we talk about `withContext`). Coroutines are more likely to be resumed on another thread (in addition, different coroutines can run on a single thread).


But, doesn't it mean that the only reason why coroutines exist – is concurrency? Let me explain.

## `Sequence`
One of the most common-place examples is the – `kotlin.sequences.Sequence<T>`. In brief, it's a lazy collection that iterates only when you start consuming elements. You can read about them more [here](https://kotlinlang.org/docs/sequences.html).

If you ever looked at `SequenceScope` sources, it uses suspend functions under the hood:
```kotlin
@RestrictSuspension
public abstract class SequenceScope<in T> internal constructor() {
    /**
     * Yields a value to the [Iterator] being built and suspends
     * until the next value is requested.
     */
    public abstract suspend fun yield(value: T)

    // ... other
}
```

> `@RestrictSuspension` disallows consumers from calling non-members suspend functions.

So, the idea is elements are consumed lazily. You can use them as regular collections and take advantage of lazy iteration.

But how does it work under the hood? Let's take a look at implementation sources:
```kotlin
private typealias State = Int  
  
private const val State_NotReady: State = 0  
private const val State_ManyNotReady: State = 1  
private const val State_ManyReady: State = 2  
private const val State_Ready: State = 3  
private const val State_Done: State = 4  
private const val State_Failed: State = 5  
  
private class SequenceBuilderIterator<T> : SequenceScope<T>(), Iterator<T>, Continuation<Unit> {  
	private var state = State_NotReady  
	private var nextValue: T? = null  
	private var nextIterator: Iterator<T>? = null  
	var nextStep: Continuation<Unit>? = null  
  
	override fun hasNext(): Boolean {  
		while (true) {  
			when (state) {  
				State_NotReady -> {}  
				State_ManyNotReady ->  
				if (nextIterator!!.hasNext()) {  
					state = State_ManyReady  
					return true  
				} else {  
					nextIterator = null  
				}  
				State_Done -> return false  
				State_Ready, State_ManyReady -> return true  
				else -> throw exceptionalState()  
			}  
  
			state = State_Failed  
			val step = nextStep!!  
			nextStep = null  
			step.resume(Unit) // IMPORTANT: it starts executing next yield 
		}  
	}  
  
	override fun next(): T {  
		when (state) {  
			State_NotReady, State_ManyNotReady -> return nextNotReady()  
			State_ManyReady -> {  
				state = State_ManyNotReady  
				return nextIterator!!.next()  
			}  
			State_Ready -> {  
				state = State_NotReady  
				@Suppress("UNCHECKED_CAST")  
				val result = nextValue as T  
				nextValue = null  
				return result  
			}  
			else -> throw exceptionalState()  
		}  
	}  
  
	private fun nextNotReady(): T {  
		if (!hasNext()) throw NoSuchElementException() else return next()  
	}  
  
	private fun exceptionalState(): Throwable = when (state) {  
		State_Done -> NoSuchElementException()  
		State_Failed -> IllegalStateException("Iterator has failed.")  
		else -> IllegalStateException("Unexpected state of the iterator: $state")  
	}  
  
  
	override suspend fun yield(value: T) {  
		nextValue = value  
		state = State_Ready  
		return suspendCoroutineUninterceptedOrReturn { c ->  
			nextStep = c  
			COROUTINE_SUSPENDED  
		}  
	}    
	override fun resumeWith(result: Result<Unit>) {  
		result.getOrThrow() // just rethrow exception if it is there  
		state = State_Done  
	}  
  
	override val context: CoroutineContext  
		get() = EmptyCoroutineContext  
}
```

   > `COROUTINE_SUSPENDED` is a special constant used internally by the Kotlin compiler to manage coroutine suspension and resumption. It's not something developers typically interact with directly, but rather, it serves as an internal signal within the coroutine machinery.

Looks a bit hard to read, isn't it? Let's go step by step:
1. First, we start with states. We have next states, let's talk about them in brief:
	- **State_NotReady**: The iterator is not ready to provide an item right now. It might be waiting for an operation or further processing to make an item available.
	- **State_ManyNotReady**: The iterator is prepared to provide multiple items, but they aren't ready immediately. It's waiting for a signal that items are ready for consumption (basically, waits for terminal operator).
	- **State_ManyReady**: The iterator is ready to provide multiple items right now. It can immediately give the next item from the sequence.
	- **State_Ready**: The iterator has a single item ready to be provided. It's set to immediately give the item when asked.
	- **State_Done**: The iterator has no more items to provide. It has completed its job of producing elements from the sequence. We reach this state when we leave `SequenceBuilder`
	- **State_Failed**: Something unexpected happened, and the iterator encountered an issue. Usually, this should not happen.
2. `hasNext` based on state, returns a value or set of values when it's ready to consume. Moreover, it starts execution of sequence on every iteration inside `while`. So, if there's `State_NotReady`, it makes it ready by executing next yields.
3. The `next` function retrieves the next item from the iterator based on its current state (same to `hasNext`). If next was called without `hasNext`, you can reach `nextNotReady()`. In other situations, it will simply return value.
4. `yield` function just changes states of sequence iterator implementation. When new elements added it changes to `State_Ready`. Using `suspendCoroutineUninterceptedOrReturn` suspends the coroutine (execution) and resumes it later. It will be started when previous coroutine (suspend point) will be finished.


> To finish my explanation, let's just end with how could we make the same functionality just by using callbacks:
> ```kotlin
> val sequence = sequence {
>    yield(1) {
>        yield(2) {
>            yield(3) { /* ... */ }
>        }
>    }
> }
> ```
>
> But, it looks a bit hard to read, isn't it? That's why coroutines are useful in this particular situation.

In the end, it doesn't look that complex, am I right?

## `DeepRecursiveScope`
Now, let's discuss another case for Kotlin Coroutines – `DeepRecursiveScope`. As you probably know, usually when specific function call itself, we have a probability of running into `StackOverflowError` as every call contributes it to our stack.

> For the same purpose, for example, also exists `tailrec` language construction. The difference is that `tailrec` cannot have branching (conditional checks) with calls to other functions.
>
> You can read about that more [here](https://kotlinlang.org/docs/functions.html#tail-recursive-functions).

So, `DeepRecursiveScope` doesn't rely on traditional stack flow, but uses all the features Coroutines offer.

We won't stop on exact implementation details of `DeepRecursiveScope` (you can take a look at it [here](https://github.com/JetBrains/kotlin/blob/7a7d392b3470b38d42f80c896b7270678d0f95c3/libraries/stdlib/src/kotlin/util/DeepRecursive.kt#L131)) as it has the same idea to `Sequence` with additional behaviour to support mechanisms that is provided, but let's discuss how Kotlin Coroutines solves this particular problem.
### Coroutines internally
How exactly it solves the problem? As I mentioned before, Coroutines are inspired by [CPS (Continuation Passing Style)](https://en.wikipedia.org/wiki/Continuation-passing_style), but it's not exactly what Kotlin Compiler does to handle coroutines that efficiently.

Kotlin Compiler uses a combination of optimizations to manage coroutines stack and execution efficiently. Let's check what exactly it does:
- **Compiler transformations**: Kotlin Compiler generates State Machine, same to what we saw in the implementation details of [Sequences](#Sequence). It doesn't get rid of all stack calls but reduces it enough to not run into `StackOverflowError`.
- **Heap-Allocation of Continuations**: In a traditional callback chain, each function call pushes data onto the call stack. If the chain is deep, this can consume a lot of stack space. In the coroutine approach, when a coroutine is suspended, its continuation is stored on the heap as an object. This continuation object holds the necessary information (stack, dispatcher, etc) to resume the coroutine's execution. This heap storage allows for a much greater capacity to handle deep call chains without risking stack overflow.
  
The exact mechanism of coroutines is next:
1. **Serialization**: Suspended coroutine's stack state is saved in a heap-allocated continuation object.
2. **Resumption**: When ready to resume, the framework sets up a native stack to mimic captured state.
3. **Memory Copy**: Serialized stack state is copied from the continuation object to the native stack.
4. **Context Configuration**: Execution context is configured to match original state.
5. **Program Counter**: Program counter is set to saved value for correct instruction.
6. **Invocation**: Continuation code is invoked using CPS, resuming execution.

> Stack restoring also helps us with resuming on different threads as they don't know anything about our coroutine's stack.

So, from now we can understand how coroutines internally work. Let's move on to other examples where Kotlin coroutines are used beyond concurrency.

## Jetpack Compose
If you ever worked with Compose and, for example, handling pointer events, you have probably mentioned that there're some hacks used from Coroutines for listening to updates:
```kotlin
@RestrictsSuspension // <---
@JvmDefaultWithCompatibility
interface AwaitPointerEventScope : Density {
	// ...
	
	suspend fun awaitPointerEvent(
        pass: PointerEventPass = PointerEventPass.Main
    ): PointerEvent
    
	suspend fun <T> withTimeoutOrNull(
        timeMillis: Long,
        block: suspend AwaitPointerEventScope.() -> T
    ): T? = block()
    
	suspend fun <T> withTimeout(
        timeMillis: Long,
        block: suspend AwaitPointerEventScope.() -> T
    ): T = block()
    
	// ...
}
```
So, as you see, scope that is used to handle pointer events is marked with `@RestrictsSuspension`. If we come to the documentation provided, we'll see next:
```markdown
This is a restricted suspension scope. Code in this scope is
always called un-dispatched and may only suspend for calls 
to [awaitPointerEvent]. These functions resume synchronously and the caller may mutate the result
**before** the next await call to affect the next stage of the input processing pipeline.
```

`awaitPointerEvent` is handled using kotlin primitives, without `kotlinx.coroutines`. As in such situation we don't need any `kotlinx.coroutines` logic (it's fairly just a callback that is called from Main-looper thread after user's action).

## Android SDK
As we can use `suspend` functions in all situations where we do need callback, there're also other useful cases where we can apply such logic. For example, while requesting permissions:
```kotlin
val result = Warden
	.with(this)
	.requestPermission(Manifest.permission.CALL_PHONE)
    
when (result) {
    is PermissionState.Denied -> dialNumber(phoneNumber)
    PermissionState.Granted -> startCall(phoneNumber)
}
```
> In example, we're using [Warden](https://github.com/alexstyl/warden) library.

## Conclusion
In conclusion, this article has explored various facets of Kotlin Coroutines, emphasizing their versatility beyond traditional concurrency tasks. We've delved into the inner workings of coroutines primitives, discussed their use in Sequences and complex problem-solving scenarios like deep recursion, and examined real-world examples that showcase their broad applicability. The title, "Coroutines are not just about concurrency," aptly reflects the diverse capabilities that Kotlin coroutines offer in modern software development.

Feel free to casually drop your expertise in the water cooler chat!
