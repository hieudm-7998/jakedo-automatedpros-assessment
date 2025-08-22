This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# [Jake Do] AutomatedPros -- React.js Assessment

This application is deployed at: [https://rickandmortydatabase.vercel.app/](https://rickandmortydatabase.vercel.app/ "https://rickandmortydatabase.vercel.app/")

---

## Client-side instruction

Make sure that your `nodejs` version is `22` or higher than `16`.

You can find `nodejs` install package [here](https://nodejs.org/en/download).

Pull this repository to your local machine, open terminal from this source code folder, then run:

```
npm install
```

Please ignore the vulnerabilities warning (due to old version of dependency packages).

Run this command to open the application on local:

```
npm run dev
```

Then, open `http://localhost:3000/` on your browser to explore the app.

---

## Breakdowns

* This project is using *Nextjs 15* and *React 19.*
* I combined *Typescript*, *zod* and *Tanstack Query* to handle most API call across the applications.
* There are 2 filters on `/characters` and `/locations` using *AbortController* to avoid race conditions.
* The filter URL is following the *the source of truth,* that means we can share the url with filter state recreating whenever visit the page. Eg. `https://rickandmortydatabase.vercel.app/characters?name=Smith&page=1&gender=male&status=alive`
* We can add any Character/Episode/Location to Favorite and those stored into *localStorage* (through *zustand/middleware*)
* I used *TailwindCSS*, *Shadcn* with *my own custom style* to make this application. So far I didn't have much time to handle the mobile responsive/theme toggle, this is a trade-off.

## Credit

Jake (Hieu Do Minh)

jakedo.developer@gmail.com

[https://jakedo-portfolio.vercel.app](https://jakedo-portfolio.vercel.app/)
