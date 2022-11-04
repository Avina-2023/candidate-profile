import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { LoaderService } from './service/loader-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'skillsProfile';
  loading: boolean= true;

  constructor(
    public loadingService: LoaderService,
  ){
  }
  ngOnInit(){
    this.listenToLoading();
  }

       /**
   * Listen and display the loading spinner.
   */
        listenToLoading(): void {
          this.loadingService.isLoadingSub.pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
            .subscribe((loading) => {
              this.loading = loading;
            });
        }
}
