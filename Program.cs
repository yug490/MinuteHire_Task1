var builder = WebApplication.CreateBuilder(args);

// This project serves the homepage from wwwroot. The page itself uses
// HTML, CSS and JavaScript, so no MVC controllers are needed here.
var app = builder.Build();

// Serve index.html when the user opens the site root, then serve the
// CSS, JavaScript and image files referenced by the page.
app.UseDefaultFiles();
app.UseStaticFiles();

// Send other browser routes back to the homepage.
app.MapFallbackToFile("index.html");

app.Run();
