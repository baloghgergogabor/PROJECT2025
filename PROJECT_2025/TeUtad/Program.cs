using Microsoft.AspNetCore.Authentication.Cookies;
using TeUtad.Components;
using TeUtad.SERVICE;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddScoped(x => new HttpClient { BaseAddress = new Uri("https://localhost:44326/") });
builder.Services.AddScoped<FelhasznaloSzerviz>();
builder.Services.AddScoped<AutoSzerviz>();
builder.Services.AddScoped<HotelSzerviz>();
builder.Services.AddScoped<LatvanyossagokSzerviz>();
builder.Services.AddScoped<RepuloJegySzerviz>();
builder.Services.AddScoped<SzerepSzerviz>();
builder.Services.AddScoped<UtazasSzerviz>();
builder.Services.AddScoped<VarosSzerviz>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "auth_token";
        options.LoginPath = "/bejelentkezes";
        options.Cookie.MaxAge = TimeSpan.FromMinutes(30);
    });
builder.Services.AddAuthorization();
builder.Services.AddCascadingAuthenticationState();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
