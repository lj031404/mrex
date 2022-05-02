import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class AppStorage {
  private static ttl = 300000; //
  private static data: any = {};

  private static remove(key: string) {
    AppStorage.data[key] = null;
  }

  public static set(key: string, value: any, ttl?) {
    AppStorage.data[key] = value;
    setTimeout(() => AppStorage.remove(key), ttl || this.ttl);
  }

  public static get(key: string) {
    return AppStorage.data[key] === undefined ? null : AppStorage.data[key];
  }

  public static cache(key: string, observer: Observable<any>, force: boolean = true): Observable<any> {
    return force || AppStorage.get(key) === null ? observer.pipe(map(res => (AppStorage.set(key, res), res))) : of(AppStorage.get(key));
    // no cache
    //return observer.pipe(map(res => (AppStorage.set(key, res), res))) 
  }

  public static flush() {
    console.log('App Storage flushed')
    Object.keys(AppStorage.data).forEach(key => AppStorage.data[key] = null);
    AppStorage.data = {};
  }

}
