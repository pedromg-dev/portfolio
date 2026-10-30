import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

export class TranslateFsLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const file = path.join(process.cwd(), 'src', 'assets', 'i18n', `${lang}.json`);
    return of(JSON.parse(fs.readFileSync(file, 'utf8')));
  }
}

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [
    provideNoopAnimations(),
    { provide: TranslateLoader, useFactory: () => new TranslateFsLoader() }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
