## SCOPIC AUCTION APP WEB APP TEST

### How to run the app

The application runs in a monorepo, with a React frontend (using Vite), and a Nest JS backend. The following are the steps to running the application:

1.  Clone the git repository provided
2.  `cd` into the root directory
3.  Run `pnpm install`. The application uses pnpm as the package manager, but you could try using npm instead, but pnpm is highly recommended.
4.  Run `pnpm run dev`. Since it is a monorepo, it should launch both the client and api server
5.  That's it!

#### SETUP

The application comes with 2 preloaded users, a user and an admin Credentials for both are as follows:

- `user@user.com / 12345678`, `admin@admin.com/12345678`

There are no loaded items as well, so admins can start creating any items necessary to start the auction

#### ASSUMPTIONS

While there were times I wished I was able to ask someone for clarity, there were a few assumptions made for the running of the project. They include:

1. Bidding on an new item. While an admin can create a new item for auctioning, it was tricky to determine if the start bid price would start at $0 or at the current price of the item. As such, the assumption was made that the starting bid price for an item that was newly created would be the price it was created with and users should only bid from that price upwards.

#### CAVEATS

While the development of this application was tricky with 'gotchas' in a few places, there were some factors affecting and surronding the current build of the auction app:

1. Env variables are available within the repository for use within the app. While it is highly not recommended to do this in production applications, for this purposes of this app and the convenience of the test, I decided to include them.

2. Access tokens are being saved within local storage. Much like the aformentioned env variables, the same applies here. The access token is added in local storage for the convenience of the application and testing
3. Email notifications within the application. While the implementation is present, finding a reliable email provider was difficult for the purposes of testing the application. There was also the possibility of using fake emails just for testing out this application, so I decided to go with Mailtrap. Since the provider was limited, feel free to use any mail provider of your choice and add the credentials in the .env file to test email notification functionality.
