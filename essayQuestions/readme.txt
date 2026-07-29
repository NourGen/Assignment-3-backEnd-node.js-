1. What is the Node.js EventLoop? (0.5 Grade)

ans: The event loop is what allows Node.js to perform non-blocking I/O operations 
     despite the fact that a single JavaScript thread is used by default
     by offloading operations to the system kernel whenever possible.

    When Node.js starts, it initializes the event loop, processes the provided input script
    which may make async API calls, schedule timers, or go to the next tick, then begins processing the event loop.
event loop structure:
    while(
        timersOperations.length
        ||
        longRunningOperations.length
        ||
        OsOperations.length
) {                                                             can't make backstep
//step1: check if any setTimeout , setInterval ready to execute         ^
//step2: check if any longRunning or os operations ready to execute     |
//step3: take a break                                                   |
//step4: setImmediate
//step5: listen to any close event
//next tick -->
}


2. What is Libuv and What Role Does It Play inNode.js? (0.5 Grade)

ans: libuv enforces an asynchronous, event-driven style of programming.
     Its core job is to provide an event loop and callback based notifications of I/O and other activities.
     libuv offers core utilities like timers, non-blocking networking support, asynchronous file system access, child processes and more.

3. How Does Node.js Handle Asynchronous Operations Under the Hood? (0.5 Grade)

ans:The node.js runs js on a single main thread when an async operation is called, it handed off to the OS kernels or to libuv thread pool (4)
    The main thread keeps running the other code without waiting once the operations finishes the EventLoop send the callback from event queue to the Call Stack 
    for execution as soon as it available

4. What is the Difference Between the Call Stack, Event Queue,and Event Loop in Node.js? (0.5 Grade)

ans:
    call Stack:Last in First Out (LIFO)structure follow the working function in the code Sync.when call fn.th fn take a place at the top of the stack
               when the fn finish it out from the stack if the and if the fn is too larg it blocking the other fns because it executeing on the main thread.
    Event-Queue:a Queue that holds the callbacks for Async operations that already has finished thier work and waiting to execute.
    EventLoop:Not a data-structure it is mechanism that checks all the time on the call stack to see if can send callback from Event-Queue to call-stack to execute
              it the bridge between them
                          
5. What is the Node.js Thread Pool and How toSet the Thread Pool Size? (0.5 Grade)

ans:The Thread Pool is a group of background worker threads managed by libuv //(default is 4) recommended:don't change it 
    used to handle the operation that don't have OS-kernel Async support
    how to change it:$env:UV_THREADPOOL_SIZE=8

6. How Does Node.js Handle Blocking and Non-Blocking Code Execution? (0.5 Grade)

ans:Blocking(like: fs.readFileSync()) execute on the main-thread and blocks the other the performance will be so bad but if all the other function 
    waiting a result of it then we use it.
    Non-Blocking is the default behavior of node.js
