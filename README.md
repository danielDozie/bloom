## Lexicon

Lexicon is a customizable, open source mobile **App Template** that provides an elegant mobile discussions experience. Built on top of [Discourse](https://www.discourse.org), a platform for communities.

### Benefits

- Launch a mobile app customized for your Discourse site
- Increase engagement with your users by adding a mobile experience
- Built with React Native: designed from the ground up for a mobile first experience - no webviews!

### Project Roadmap

Lexicon is currently under active development. You can stay up to date on the features we're working on by viewing the [Project Roadmap](https://github.com/orgs/lexiconhq/projects/1/views/1).

## Installation

Clone the repository and navigate into it:

```
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

Next, execute the following command.

```
$ yarn && yarn generate
```

`yarn` will install the dependencies needed, while `yarn generate` will launch two processes sequentially.

- First, it will generate a GraphQL [schema](https://nexusjs.org/docs/guides/schema) in the `api` directory.

- Then it will create a new folder called `generated` in the `frontend` directory. This contains the GraphQL query and mutation types based on the schema generated above. Click [here](https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output) to learn more about this process.

## Quick Start

You can run the Lexicon Mobile App and test it out by running this command from the project root:

```
$ yarn quickstart
```

This will simultaneously launch two processes:

- The Prose GraphQL API Server
- The local Expo dev server, which will enable you to launch the React Native app from your device

The `quickstart` commands are designed to point at an existing Discourse server, [Discourse Meta](https://meta.discourse.org).

Configuring it to point at your own Discourse site will take additional configuration.

You can learn more about this in the [Lexicon Documentation](https://docs.lexicon.is/quick-start).

## Example: Specifying a custom Discourse Site URL

This is a brief example to demonstrate how to quickly point the project at a custom Discourse site.

In the example below, we'll use the [Rust Users forum](https://users.rust-lang.org).

If you'd like, simply change that URL to the URL for your Discourse site in order to follow along with your own site.

After running `yarn && yarn generate` from the project root, execute the following:

```
$ echo "PROSE_DISCOURSE_HOST=https://users.rust-lang.org" > api/.env
$ echo "MOBILE_PROSE_URL=http://localhost" > frontend/.env
```

The above statements setup the required environment variables for the Prose GraphQL API and the frontend.

- The API (via `PROSE_DISCOURSE_HOST`) has been instructed to attempt to connect to a Discourse instance at `https://users.rust-lang.org`.

- The frontend (via `MOBILE_HOST_PROSE`) has been instructed to attempt to connect to a Prose GraphQL API running at `http://localhost` (port 80).

### Important Notes

The API default config instructs the server to listen on a hostname of `0.0.0.0` (the public interface) and port 80.

<details><summary>The frontend takes some additional steps so that you can use the app on your mobile device... <b>(Read More)</b></summary>

This may seem confusing at first, but it actually saves you a bit of time.

In this scenario, the frontend app is running on your mobile device via Expo Go, and the Prose GraphQL API is running on your development machine (e.g. laptop).

So, how could we expect the mobile app to be able to locate a server running on a different device, when we have only told the frontend app to attempt to connect to the API on `localhost`? The API isn't running on your mobile device.

The traditional way to deal with this is to force you to manually lookup your local IP address on the network that your mobile device is also connected to. It would be a value like `192.168.0.53`.

Then, you'd have to update `frontend/.env` with that value.

Even worse, if your local IP address ever changes, everything would break, and you'd have to update the environment variable again.

That's kind of a pain, and fortunately Expo provides us with an easier way.

We leverage a property from Expo called `debuggerHost` in order to automatically locate the IP address of your development machine. From that value, we strip off the port number (typically 19000) and append the port number that your Prose GraphQL API is running on (defaults to port 80).

With this approach, it should all just work automatically.

If you're interested, you can read the code for how we achieve this here: [src/frontend/constants/app.ts](https://github.com/lexiconhq/lexicon/blob/master/frontend/src/constants/app.ts#L30-L46)

</details>

### Start the Prose GraphQL API server

Next, start the Prose GraphQL API server.

```
$ yarn --cwd api start
```

You should see output that looks similar to this:

```
Attempting to reach your Discourse instance at https://users.rust-lang.org...
Your Discourse instance was reachable and valid.


 -- Prose GraphQL Discourse API --
forwarding Discourse requests to https://users.rust-lang.org

💡   🧘 Yoga -   Running GraphQL Server at http://0.0.0.0:8999/graphql
```

### Start Expo to run the frontend app

After that, **in a separate shell**, start Expo to run the frontend app:

```
$ cd frontend
$ yarn start
```

You should see the typical Expo output with a QR code that you can scan from your mobile device to open the app, as well as some output similar to this:

```
Starting project at lexicon/frontend
Starting Metro Bundler
...

› Metro waiting on exp://192.168.0.53:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

...

Logs for your project will appear below. Press Ctrl+C to exit.
Started Metro Bundler
```

### Scan the QR code and open the app on your mobile device

Once you've scanned the QR code on your mobile device, you will be instructed to download Expo / Expo Go if you haven't already.

After that, you should be able to open the Lexicon frontend on your mobile device via the QR code, and will be able to interact with the Discourse site you configured Prose to connect to.

---

## Professional Support

With official support, you get expert help straight from the core team. We provide dedicated support, prioritize feature requests, deployment strategies, advice on best practices, design decisions, and team augmentation. Reach out to us for consulting at support@kodefox.com.

## Documentation

The full documentation for Lexicon is located at [docs.lexicon.is](https://docs.lexicon.is).

If you'd like to contribute to it, or just want to browse it locally, you can run the following command from the project root:

```
yarn docs:install
yarn docs:start
```

### Note: Node 16 required

Our tooling, Docusaurus v2, requires Node version 16 in order to work with it.

You can check your current Node version by running the following command:

```
$ node --version
v14.17.0
```

In order to make this process simpler, we recommend installing [nvm](https://github.com/nvm-sh/nvm) (Node version manager) onto your development machine.

Then you'll be able to quickly switch between versions without issue:

```
$ nvm use 14
Now using node v14.17.0 (npm v8.15.1)
```
