# Hirely Homepage

A responsive recreation of the Hirely homepage, served by ASP.NET Core 9. The frontend is plain HTML, CSS and JavaScript.

## Run the project

1. Open `HirelyTask1.csproj` in Visual Studio 2022 with the .NET 9 SDK installed, or open a terminal in this folder.
2. Run `dotnet restore`.
3. Run `dotnet run`, or press F5 in Visual Studio.

## Files

- `Program.cs` configures the app to serve the homepage and its static assets.
- `wwwroot/index.html` contains the page markup.
- `wwwroot/styles.css` contains the layout, styling and responsive rules.
- `wwwroot/app.js` handles the navigation, feature section, FAQ and other interactions.

## Homepage details

The page includes the hero, benefits, key features, testimonial, payroll section, partner logos, extra features, FAQ, final call to action and footer. The Key Features section has a sticky visual on desktop, scroll-linked active content, previous/next controls and keyboard navigation. The layout adapts for smaller screens.

Fonts and images are loaded from Framer's CDN, so an internet connection is needed for those assets. The newsletter interaction is only a frontend confirmation; it does not send or save submissions.

## Build

Use `dotnet build` to check the project in your local .NET 9 environment.
