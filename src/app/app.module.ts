import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { ThemeSwitchComponent } from './components/theme-switch/theme-switch.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component';


//Use this route in hosting (Production)
// export function HttpLoaderFactory(http: HttpClient) {
//   console.log("translate loader running..");
//   return new TranslateHttpLoader(http, "/portfolio/assets/i18n/", ".json");
// }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WorkExperienceComponent,
    SocialMediaComponent,
    ThemeSwitchComponent,
    TimelineComponent,
    TimelineItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

