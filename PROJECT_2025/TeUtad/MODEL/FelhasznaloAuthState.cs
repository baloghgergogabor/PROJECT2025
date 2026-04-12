using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace TeUtad.MODEL
{
    public class FelhasznaloAuthState : AuthenticationStateProvider
    {
        private readonly IHttpContextAccessor _httpContAccessor;
        private ClaimsPrincipal _mostaniFelhasznalo = new ClaimsPrincipal(new ClaimsIdentity());

        public FelhasznaloAuthState(IHttpContextAccessor httpContAccessor)
        {
            _httpContAccessor = httpContAccessor;
        }

        public override Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            var felhasznalo = _httpContAccessor.HttpContext?.User;

            if (felhasznalo?.Identity?.IsAuthenticated == true)
            {
                _mostaniFelhasznalo = felhasznalo;
            }
            return Task.FromResult(new AuthenticationState(_mostaniFelhasznalo));
        }
        public void UpdateAuthenticationState(ClaimsPrincipal ujFelhasznalo)
        {
            _mostaniFelhasznalo = ujFelhasznalo;
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(ujFelhasznalo)));
        }
    }
}
