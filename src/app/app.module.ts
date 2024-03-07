import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { ThemeSwitchComponent } from './components/theme-switch/theme-switch.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component';
import { ButtonComponent } from './components/button/button.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SectionWithHeaderComponent } from './components/section-with-header/section-with-header.component';
import { IndexSidebarComponent } from './index-sidebar/index-sidebar.component';
import { IndexSidebarItemComponent } from './index-sidebar/index-sidebar-item/index-sidebar-item.component';
import { MainInformationComponent } from './main-information/main-information.component';
import { TechLogoComponent } from './components/tech-logo/tech-logo.component';
import { DrawerMenuComponent } from './drawer-menu/drawer-menu.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { PdfDownloaderComponent } from './components/pdf-downloader/pdf-downloader.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { SkillsComponent } from './skills/skills.component';

//Use this route in hosting (Production)
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, "/portfolio/assets/i18n/", ".json");
// }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SocialMediaComponent,
    ThemeSwitchComponent,
    TimelineComponent,
    TimelineItemComponent,
    ButtonComponent,
    AboutMeComponent,
    SectionWithHeaderComponent,
    IndexSidebarComponent,
    IndexSidebarItemComponent,
    MainInformationComponent,
    TechLogoComponent,
    DrawerMenuComponent,
    LanguageSelectorComponent,
    PdfDownloaderComponent,
    ContactComponent,
    ProjectsComponent,
    ProjectCardComponent,
    SkillsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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

