# redux-eventstore
[![Build Status](https://snap-ci.com/camjackson/redux-eventstore/branch/master/build_image)](https://snap-ci.com/camjackson/redux-eventstore/branch/master)

Easy [CQRS](http://martinfowler.com/bliki/CQRS.html) and [event sourcing](http://martinfowler.com/eaaDev/EventSourcing.html)
with [Node.js](https://nodejs.org/en/), [Redux](http://redux.js.org), and [Event Store](https://geteventstore.com/).

***Probably not ready for production yet! See 'Limitations' below.***

This library is meant for event-based persistence on the server. You might be able to get it to work in the browser
using something like [browserify](http://browserify.org/), but only if you're ok with people writing directly to your
database. (If anyone does get it working in the browser, please let us know!)

## Installation
```sh
npm install --save redux-eventstore
```

## Usage

For a full example, see [`demo-app.js`](https://github.com/camjackson/redux-eventstore/blob/master/examples/demo-app.js).
It shows two separate servers communicating via Event Store: one receives events via POST request and writes to a stream;
the other subscribes to the stream and exposes the aggregated state via GET request.

### `subscribeToStream(host, stream, dispatch, [pollPeriod=1000])`

Subscribes to an Event Store stream, dispatching all events from that stream to your redux store. Initially, all previous
events will be played through as fast as possible, after which the stream will be polled for new events periodically.
Events are dispatched synchronously, in the order in which they appear in the stream.

Just like when you call `dispatch` on a redux store in the frontend, this method has two main uses:

1. To [reduce](http://redux.js.org/docs/basics/Reducers.html) the sequence of events into an in-memory state, which can then be queried
2. To perform some [asynchronous task](http://redux.js.org/docs/advanced/AsyncActions.html) or side-effect when a particular event occurs

**Parameters:**

 - `host`: The host where your Event Store instance is located. Include the scheme (protocol), FQDN, and port
 - `stream`: The name of the stream to subscribe to
 - `dispatch`: The callback function that will receive all events read off the stream. This is intended to be the dispatch
 method of a redux store, but really it could be any function with one parameter
 - `pollPeriod`: How many milliseconds to wait between polls of the stream (*default: 1000*)

**Example:**

```js
const store = redux.createStore(rootReducer);
subscribeToStream('https://event-store.my-domain.com:2113', 'my-stream', store.dispatch, 500);
```

### `streamWriter(host, stream)`

Creates a function that allows you to write events to an Event Store stream.

**Parameters:**

 - `host`: The host where your Event Store instance is located. Include the scheme (protocol), FQDN, and port
 - `stream`: The name of the stream to write to

**Example:**

```js
const writeToStream = streamWriter('https://event-store.my-domain.com:2113', 'my-stream');
writeToStream({ type: 'USER_CREATED', name: "Jane Smith" });
```

## Events vs. actions
Typically with redux, you dispatch **actions**, which are imperatively named. For example: `CREATE_USER`, or `TOGGLE_VISIBILITY`.
This makes sense when you are *asking* for something to happen, and some other part of the application (e.g. a reducer)
is going to handle the request.

However, with Event Store (or event sourcing in general), it makes more sense to talk about **events** in the past tense,
representing something that has already happened. For example: `USER_CREATED`, or `VISIBILITY_TOGGLED`.
[More explanation here](http://docs.geteventstore.com/introduction/3.9.0/event-sourcing-basics/).

This is why the `redux-eventstore` docs, examples, and source code all refer to events, rather than actions. You should
keep this in mind when using it.

## Limitations
  - Similarly, events are not validated when they are dispatched or read. If the event type is missing (like it would be
  for a thunk, for example), who knows what could happen!
  ([#8](https://github.com/camjackson/redux-eventstore/issues/8) and [#9](https://github.com/camjackson/redux-eventstore/issues/9))
  - There is almost zero handling of server errors
  ([#11](https://github.com/camjackson/redux-eventstore/issues/11) and [#12](https://github.com/camjackson/redux-eventstore/issues/12))
  - There is no auth yet ([#13](https://github.com/camjackson/redux-eventstore/issues/13))
  - There is no logging, which may make troubleshooting difficult ([#4](https://github.com/camjackson/redux-eventstore/issues/4))
  - It was developed with node v6, and other versions have not been tested yet. ([#5](https://github.com/camjackson/redux-eventstore/issues/5))
