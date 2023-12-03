import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeIT from '@angular/common/locales/it';
import localeNL from '@angular/common/locales/nl';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP } from '@ionic-native/http/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigService } from './config/config.service';
import { AppEffects } from './state/app.effects';
import { PipesModule } from './shared/pipes/pipes.module';
import { TabBarModule } from './components/tab-bar/tab-bar.module';
import { appReducer } from './state/app.reducer';
import { enterAnimation } from './shared/animations/nav-navigation';
import { reducer } from './state/reducers/filter.reducer';
import { searchReducers } from './state/reducers/search.reducers';
import { geolocationReducer } from './state/reducers/geolocation.reducer';
import { selectedDateReducers } from './state/reducers/selectedDate.reducer';
import { clubReducer } from './club/store/club.reducers';
import { ClubEffects } from './club/store/club.effects';
import { SignModule } from './modal/auth/sign/sign.module';
import { SignInModule } from './modal/auth/sign-in/sign-in.module';
import { SignUpModule } from './modal/auth/sign-up/sign-up.module';
import { ManageMethodModule } from './components/payments/manage-method/manage-method.module';
import { ChoiceActivityModule } from './modal/choice-activity/choice-activity.module';
import { BookingDetailModule } from './modal/booking/booking-detail/booking-detail.module';
import { SearchInputBtnModule } from './components/search-input-btn/search-input-btn.module';
import { ModalHeaderModule } from './components/modal-header/modal-header.module';
import { GeolocationService } from './shared/services/geolocation/geolocation.service';
import { ClubDetailModule } from './club-detail/club-detail.module';
import { AvatarNameModule } from './components/avatar-name/avatar-name.module';
import { UserReducers } from './state/reducers/user.reducers';
import { validatedSearchReducer } from './state/reducers/validated-search.reducers';
import {DefaultHeaderModule} from './components/default-header/default-header.module';
import {PlayerModule} from './player/player.module';
import {MyCreditsModule} from './account/my-credits/my-credits.module';
import {MyBookingsModule} from './account/my-bookings/my-bookings.module';
import {MyMatchesModule} from './account/my-matches/my-matches.module';
import {MyWalletsModule} from './account/my-wallets/my-wallets.module';
import {MySubscriptionsModule} from './account/my-subscriptions/my-subscriptions.module';
import {MyActivitiesModule} from './account/my-activities/my-activities.module';
import {MyClubsModule} from './account/my-clubs/my-clubs.module';
import {MyEventsModule} from './account/my-events/my-events.module';
import {MyFriendsModule} from './account/my-friends/my-friends.module';
import {MyOperationsModule} from './account/my-operations/my-operations.module';
import {MyPaymentTypeModule} from './account/my-payment-type/my-payment-type.module';
import {MyPreferencesModule} from './account/my-preferences/my-preferences.module';
import {InformationsModule} from './account/informations/informations.module';
import {HeaderMbModule} from './components/mb/home/header/header-mb.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {PasswordModule} from './account/password/password.module';
import {CguModule} from './account/cgu/cgu.module';
import {PhoneNumberModule} from './account/phone-number/phone-number.module';
import { CurrencyPipe } from '@angular/common';
import { MatchCommentsModule } from './matches/match-comments/match-comments.module';
import { clubNewsReducer } from './state/reducers/clubNews.reducer';
import { ClubNewsEffects } from './state/effects/clubNews.effects';
import { ClubNewsDetailsModule } from './club-news/club-news-details/club-news-details.module';
import { LocaleService } from './shared/services/translate/locale.service';
import { myMatchesReducer } from './state/reducers/myMatches.reducer';
import { ShopModule } from './shop/shop.module';
import { CartState } from './shop/state/cart.state';
import { AvatarNameTabletModule } from './components/avatar-name-tablet/avatar-name-tablet.module';
import { MatchCardTabletModule } from './components/match-card-tablet/match-card-tablet.module';
import { EnvironmentService } from './shared/services/environment/environment.service';
import { ChoiceClubModule } from './modal/choice-club/choice-club.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ClubIdStorageService } from './shared/services/clud-id-storage/club-id-storage.service';
import { environment } from 'src/environments/environment.prod';
import { MyConsumptionModule } from './account/my-consumption/my-consumption.module';
import { MyCoursesModule } from './account/my-courses/my-courses.module';
import {UpdateAppModalModule} from "./modal/update-app-modal/update-app-modal.module";
import {ShopReducers} from "./state/reducers/shop.reducers";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import { CalendarReModule } from './modal/calendar/calendar.module';
import {BookingGroupPaymentModule} from "./modal/booking-group-payment/booking-group-payment.module";
import {ListSubscriptionsClubModule} from "./modal/list-subscriptions-club/list-subscriptions-club.module";
import {ProcessCartPaymentModule} from "./modal/process-cart-payment/process-cart-payment.module";
import {FormsModule} from "@angular/forms";
import {OptionsGroupSelectionModule} from "./options-group-selection/options-group-selection.module";
import {BookingGroupFormModule} from "./booking-group-form/booking-group-form.module";
import {ShopGiftFormModule} from "./shop/components/shop-gift-form/shop-gift-form.module";

import {Brightness} from "@ionic-native/brightness/ngx";

import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

import {ClassCommentsModalModule} from "./club-booking-list/components/class-comments-modal/class-comments-modal.module";
import {ScheduleSportModule} from "./components/schedule-sport/schedule-sport.module";
import {ChoicesDurationModule} from "./components/choices-duration/choices-duration.module";
import { LazyImageModule } from './shared/lazy-img/lazy-img.module';

import { GoogleTagManagerModule } from 'angular-google-tag-manager';

import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { ErrorInterceptor } from './shared/helpers/error.interceptor';
import {CookieService} from "ngx-cookie-service";
import {accountReducer} from "./account/store/account.reducers";
import {ErrorApiModule} from "./error-api/error-api.module";


registerLocaleData(localeFr);
registerLocaleData(localeIT);
registerLocaleData(localeNL);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function setAppLocale(localeService: LocaleService) {
    return () => localeService.setAppLocale();
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot({
            navAnimation: enterAnimation,
            //mode: "ios"
        }),
        GoogleTagManagerModule.forRoot({
            id: 'GTM-NVNQ2X7',
        }),
        AppRoutingModule,
        StoreModule.forRoot({
            clubNews: clubNewsReducer,
            myMatches: myMatchesReducer,
            filter: reducer,
            search: searchReducers,
            validatedSearch: validatedSearchReducer,
            geolocation: geolocationReducer,
            selectedDate: selectedDateReducers,
            user: UserReducers,
            appReducer,
            clubState: clubReducer,
            shop: ShopReducers,
            accountState: accountReducer
        }, {
            runtimeChecks: {
                strictStateImmutability: false,
                strictActionImmutability: false,
                strictStateSerializability: false,
                strictActionSerializability: false,
            }
        }),
        EffectsModule.forRoot([AppEffects, ClubEffects, ClubNewsEffects]),
        StoreDevtoolsModule.instrument({
            name: 'Doinsport - DevTools',
            maxAge: 25,
            logOnly: environment.production
        }),
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        LazyImageModule,
        PipesModule,
        TabBarModule,
        SignModule,
        SignInModule,
        SignUpModule,
        ManageMethodModule,
        ChoiceActivityModule,
        BookingDetailModule,
        SearchInputBtnModule,
        ModalHeaderModule,
        ClubDetailModule,
        AvatarNameModule,
        DefaultHeaderModule,
        MyCreditsModule,
        MyBookingsModule,
        MyWalletsModule,
        MySubscriptionsModule,
        MyActivitiesModule,
        MyClubsModule,
        MyEventsModule,
        MyFriendsModule,
        MyMatchesModule,
        MyCoursesModule,
        MyOperationsModule,
        MyPaymentTypeModule,
        PasswordModule,
        CguModule,
        PhoneNumberModule,
        MyPreferencesModule,
        InformationsModule,
        PlayerModule,
        HeaderMbModule,
        MatchCommentsModule,
        ClubNewsDetailsModule,
        MyConsumptionModule,
        AvatarNameTabletModule,
        MatchCardTabletModule,
        ChoiceClubModule,
        Ng2SearchPipeModule,
        UpdateAppModalModule,
        CalendarReModule,
        BookingGroupPaymentModule,
        ListSubscriptionsClubModule,
        ProcessCartPaymentModule,
        OptionsGroupSelectionModule,
        FormsModule,
        BookingGroupFormModule,
        ShopGiftFormModule,
        ClassCommentsModalModule,
        ShopModule,
        ScheduleSportModule,
        ChoicesDurationModule,
        ErrorApiModule
    ],
    providers: [
        CookieService,
        BarcodeScanner,
        Brightness,
        OneSignal,
        LocaleService,
        SplashScreen,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: setAppLocale,
            deps: [LocaleService],
            multi: true,
        },
        {
            provide: LOCALE_ID,
            useFactory: (localeService: LocaleService) => {
                return localeService.locale;
            },
            deps: [LocaleService]
        },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        SocialSharing,
        HTTP,
        Geolocation,
        GeolocationService,
        Stripe,
        Clipboard,
        // OneSignal,
        // BranchIo,
        InAppBrowser,
        PhotoViewer,
        CurrencyPipe,
        CartState,
        EnvironmentService,
        ClubIdStorageService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    exports: [],
    bootstrap: [AppComponent]
})

export class AppModule {}
