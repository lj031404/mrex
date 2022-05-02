import { NgModule } from '@angular/core'
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'

import { RouterMap } from '@app/core/utils/router-map.util'
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard'
import { SyncResolver } from '@app/core/resolver/sync.resolver'

import { SubscriptionComponent } from '@app-pages/settings/subscription/subscription.component';
import { TermOfUseComponent } from './pages/settings/modals/term-of-use/term-of-use.component'
import { PrivacyPolicyComponent } from './pages/settings/modals/privacy-policy/privacy-policy.component'

const routes: Routes = [
	{
		path: RouterMap.Signin.path, loadChildren: './pages/login/login.module#LoginModule',
		data: { key: RouterMap.Signin.path, shouldDetach: 'no' }
	},
	{
		path: RouterMap.Signup.path, loadChildren: './pages/signup/signup.module#SignupModule',
		data: { key: RouterMap.Signup.path, shouldDetach: 'no' }
	},
	{
		path: RouterMap.OAuthSignup.path, loadChildren: './pages/signup-oauth/signup-oauth.module#SignupOauthModule',
		data: { key: RouterMap.OAuthSignup.path, shouldDetach: 'no' }
	},
	{
		path: RouterMap.PasswordForgot.path, loadChildren: './pages/password-forgot/password-forgot.module#PasswordForgotModule',
		data: { key: 'articles', shouldDetach: 'no' }
	},
	{
		path: RouterMap.Mocked.path, loadChildren: './shared/mocked/mocked.module#MockedModule'
	},
	{
		path: RouterMap.Settings.TERM_OF_USE, component: TermOfUseComponent, data: { key: RouterMap.Settings.TERM_OF_USE }
	},
	{
		path: RouterMap.Settings.PRIVACY, component: PrivacyPolicyComponent, data: { key: RouterMap.Settings.PRIVACY }
	},
	{
		path: 'loading', loadChildren: './pages/loading/loading.module#LoadingModule', canActivate: [AuthenticationGuard],
		data: { key: 'loading', shouldDetach: 'no' }
	},
	{
		path: '', canActivate: [AuthenticationGuard], resolve: { synced: SyncResolver },
		children: [
			{
				// default route
				path: '', pathMatch: 'full', redirectTo: RouterMap.Home.path
			},
			{
				path: RouterMap.Home.path, loadChildren: './pages/home/home.module#HomeModule', 
				data: { key: RouterMap.Home.path }
			},
			{
				path: RouterMap.Portfolio.path, loadChildren: './pages/portfolio/portfolio.module#PortfolioModule',
				data: { key: RouterMap.Portfolio.path }
			},
			{
				path: RouterMap.Watchlist.path, loadChildren: './pages/watchlist/property.module#PropertyModule', 
				data: { key: RouterMap.Watchlist.path }
			},
			{
				path: RouterMap.Market.path, loadChildren: './pages/market/market.module#MarketModule',
				data: { key: RouterMap.Market.path }
			},
			{
				path: RouterMap.College.path, loadChildren: './pages/college/college.module#CollegeModule',
				data: { key: RouterMap.College.path }
			},
			{
				path: RouterMap.Settings.path, loadChildren: './pages/settings/settings.module#SettingsModule',
				data: { key: RouterMap.Settings.path }
			},
			{
				path: RouterMap.Subscription.path, component: SubscriptionComponent,
				data: { key: RouterMap.Subscription.path }
			},
			{
				path: RouterMap.Articles.ARTICLES, loadChildren: './pages/article/article.module#ArticleModule',
				data: { key: RouterMap.Articles.ARTICLES }
			},
			{
				path: RouterMap.Video.path, loadChildren: './pages/article/article.module#ArticleModule',
				data: { key: RouterMap.Video.path }
			},
			{
				path: RouterMap.Videos.path, loadChildren: './pages/videos/videos.module#VideosModule',
				data: { key: RouterMap.Videos.path }
			},
			{
				path: '**', redirectTo: ''
			}
		]
	},
	{
		path: '', redirectTo: 'login', pathMatch: 'full'
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes, { 
		scrollPositionRestoration: 'enabled',
		preloadingStrategy: PreloadAllModules
	 })],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
