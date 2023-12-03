import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shared/services/security/auth-guard.service';

const routes: Routes = [
  /* { path: '', redirectTo: '/matches', pathMatch: 'full' }, */
  { path: '', redirectTo: '/home', pathMatch: 'full', data: {animation: 'Auth'} },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), data: {animation: 'Home'} },
  {
    path: 'account',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'me',
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: 'informations',
        loadChildren: () => import('./account/informations/informations.module').then( m => m.InformationsModule)
      },
      {
        path: 'my-activities',
        loadChildren: () => import('./account/my-activities/my-activities.module').then( m => m.MyActivitiesModule)
      },
      {
        path: 'my-bookings',
        loadChildren: () => import('./account/my-bookings/my-bookings.module').then( m => m.MyBookingsModule)
      },
      {
        path: 'my-clubs',
        loadChildren: () => import('./account/my-clubs/my-clubs.module').then( m => m.MyClubsModule)
      },
      {
        path: 'my-credits',
        loadChildren: () => import('./account/my-credits/my-credits.module').then( m => m.MyCreditsModule)
      },
      {
        path: 'my-consumption',
        loadChildren: () => import('./account/my-consumption/my-consumption.module').then( m => m.MyConsumptionModule)
      },
      {
        path: 'my-events',
        loadChildren: () => import('./account/my-events/my-events.module').then( m => m.MyEventsModule)
      },
      {
        path: 'my-friends',
        loadChildren: () => import('./account/my-friends/my-friends.module').then( m => m.MyFriendsModule)
      },
      {
        path: 'my-matches',
        loadChildren: () => import('./account/my-matches/my-matches.module').then( m => m.MyMatchesModule)
      },
      {
        path: 'my-courses',
        loadChildren: () => import('./account/my-courses/my-courses.module').then( m => m.MyCoursesModule)
      },
      {
        path: 'my-operations',
        loadChildren: () => import('./account/my-operations/my-operations.module').then( m => m.MyOperationsModule)
      },
      {
        path: 'my-payment-type',
        loadChildren: () => import('./account/my-payment-type/my-payment-type.module').then( m => m.MyPaymentTypeModule)
      },
      {
        path: 'my-preferences',
        loadChildren: () => import('./account/my-preferences/my-preferences.module').then( m => m.MyPreferencesModule)
      },
      {
        path: 'my-subscriptions',
        loadChildren: () => import('./account/my-subscriptions/my-subscriptions.module').then( m => m.MySubscriptionsModule)
      },
      {
        path: 'my-wallet',
        loadChildren: () => import('./account/my-wallets/my-wallets.module').then( m => m.MyWalletsModule)
      },
      {
        path: 'params',
        loadChildren: () => import('./account/params/params.module').then( m => m.ParamsModule)
      }
    ]
  },
  {
    path: 'search-club',
    loadChildren: () => import('./search-club/search-club.module').then( m => m.SearchClubPageModule),
    data: {animation: 'SearchClub'}
  },
  {
    path: 'filters',
    loadChildren: () => import('./modal/filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'my-bookings',
    loadChildren: () => import('./account/my-bookings/my-bookings.module').then( m => m.MyBookingsModule)
  },
  {
    path: 'matches/:matchId/:activityId',
    loadChildren: () => import('./matches/matches.module').then( m => m.MatchesModule)
  },
  {
    path: 'matches/:bookingIRI',
    loadChildren: () => import('./matches/matches.module').then( m => m.MatchesModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('./matches/matches.module').then( m => m.MatchesModule)
  },
  {
    path: 'club/:id',
    loadChildren: () => import('./club/club.module').then( m => m.ClubModule)
  },
  {
    path: 'place-search',
    loadChildren: () => import('./modal/place-search/place-search.module').then( m => m.PlaceSearchPageModule)
  },
  {
    path: 'select-booking',
    loadChildren: () => import('./club-booking-list/club-booking-list.module').then( m => m.ClubBookingListPageModule)
  },
  {
    path: 'booking-group-selection',
    loadChildren: () => import('./booking-group-selection/booking-group-selection.module').then( m => m.BookingGroupSelectionModule)
  },
  {
    path: 'booking-group-form',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./booking-group-form/booking-group-form.module').then( m => m.BookingGroupFormModule)
  },
  {
    path: 'choices-activities',
    loadChildren: () => import('./choices-activities/choices-activities.module').then( m => m.ChoicesActivitiesModule)
  },
  {
    path: 'choices-prestations',
    loadChildren: () => import('./choices-prestations/choices-prestations.module').then( m => m.ChoicesPrestationsModule)
  },
  {
    path: 'options-group-selection',
    loadChildren: () => import('./options-group-selection/options-group-selection.module').then( m => m.OptionsGroupSelectionModule)
  },
  {
    path: 'select-booking/:id',
    loadChildren: () => import('./club-booking-list/club-booking-list.module').then( m => m.ClubBookingListPageModule)
  },
  {
    path: 'booking-sport',
    loadChildren: () => import('./modal/booking/booking-sport/booking-sport.module').then( m => m.BookingSportPageModule)
  },
  {
    path: 'booking-sport-confirm',
    loadChildren: () => import('./modal/booking/booking-sport-confirm/booking-sport-confirm.module').then( m => m.BookingSportConfirmModule)
  },
  {
    path: 'receipt',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: 'shop',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./shop/shop.module').then( m => m.ShopModule)
  },
  { path: 'error-api', loadChildren: () => import('./error-api/error-api.module').then(m => m.ErrorApiModule) },
  { path: '**', redirectTo: '/home'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {}
