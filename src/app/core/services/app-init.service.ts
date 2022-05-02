import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment as prodEnv } from '@env/environment.prod';
import { environment as qaEnv } from '@env/environment.qa'
import { environment as localEnv } from '@env/environment.local'
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  private config$: Observable<any>;

  constructor(
    private environmentService: EnvironmentService
  ) { }

  /**
     * Method for loading configuration
     */
  loadConfiguration(env) {
    localStorage.setItem('apiServer', env)
    if (env === 'local') {
      this.config$ = of(localEnv)
    }
    else if (env === 'qa') {
      this.config$ = of(qaEnv)
    } else {
      this.config$ = of(prodEnv)
    }

    this.environmentService.setEnvironment(this.config$);
    return this.config$;
  }
}
