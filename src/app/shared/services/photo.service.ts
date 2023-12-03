import { Injectable } from '@angular/core';
import { CameraDirection, Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AccountService } from './account/account.service';
import { LoaderService } from './loader/loader.service';
import { UserService } from './storage/user.service';
import { AuthService } from './user/auth.service';
import * as AccountActions from "../../account/store/account.actions";
import {Store} from "@ngrx/store";

// interface Photo {
//   filepath: string;
//   webviewPath: string;
//   base64?: string;
// }

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  IMAGE_QUALITY = 100;
  // photo: SafeResourceUrl;
  PHOTO_STORAGE = "avatar";
  avatarAsBlobSub$ = new BehaviorSubject<any>(null);

  avatarAsBlob$ = this.avatarAsBlobSub$.asObservable();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private accountService: AccountService,
    private userService: UserService,
    private authService: AuthService,
    private accountStore: Store<any>,
    private loaderService: LoaderService,
    private alertCtrl: AlertController
    // private cropService: Crop
  ) { }


  async changeAvatar(origin, avatarIRI?) {
    let actionSheet;

    if (!avatarIRI) {
      actionSheet = await this.actionSheetCtrl.create({
        header: this.translate.instant('action_sheet_select_picture'),
        subHeader: this.translate.instant('action_sheet_select_picture_sub'),
        buttons: [
          {
            text: this.translate.instant('action_sheet_pick_pic'),
            handler: async () => {
              //const savedPic = 
              await this.addPic('photos', origin);
              // this.cropService.crop(savedPic.filepath, {quality: this.IMAGE_QUALITY})
            }
          },
          {
            text: this.translate.instant('action_sheet_take_pic'),
            handler: async () => {
              //const savedPic =
               await this.addPic('camera', origin);
              // this.cropService.crop(savedPic.filepath, {quality: this.IMAGE_QUALITY})
            }
          },
          {
            text: this.translate.instant('cancel'),
            role: 'cancel'
          }
        ]
      });
    } else {
      actionSheet = await this.actionSheetCtrl.create({
        header: this.translate.instant('action_sheet_select_picture'),
        subHeader: this.translate.instant('action_sheet_select_picture_sub'),
        buttons: [
          {
            text: this.translate.instant('action_sheet_pick_pic'),
            handler: async () => {
              //const savedPic = 
              await this.addPic('photos', origin);
              // this.cropService.crop(savedPic.filepath, {quality: this.IMAGE_QUALITY})
            }
          },
          {
            text: this.translate.instant('action_sheet_take_pic'),
            handler: async () => {
              //const savedPic = 
              await this.addPic('camera', origin);
              // this.cropService.crop(savedPic.filepath, {quality: this.IMAGE_QUALITY})
            }
          },
          {
            text: this.translate.instant('action_sheet_delete_pic'),
            handler: async () => {
              if (avatarIRI !== undefined) {
                this.deleteAvatar(avatarIRI);
              }
              // this.cropService.crop(savedPic.filepath, {quality: this.IMAGE_QUALITY})
            }
          },
          {
            text: this.translate.instant('cancel'),
            role: 'cancel'
          }
        ]
      });
    }
    actionSheet.present();
  }

  async deleteAvatar(avatarIRI) {

    const alert = await this.alertCtrl.create({
      cssClass: 'do-alert',
      header: this.translate.instant('picture_deletion_alert_title'),
      message: this.translate.instant('picture_deletion_alert_text'),
      buttons: [{
        text: this.translate.instant('ok'),
        handler: async () => {
          this.loaderService.presentLoading();
          return this.accountService.deleteAvatar(avatarIRI)
            .subscribe( () => {
              this.authService.getConnectedUser()
                .subscribe( async (data) => {
                  await this.accountStore.dispatch(AccountActions.setMe({ data }));
                  if (this.loaderService.loading !== undefined) {
                    this.loaderService.dismiss();
                  }
                });
                /* .catchError( error => {
                  if (this.loaderService.loading !== undefined) {
                    this.loaderService.dismiss();
                  }
                }); */
            });
        }
      },
      {
        text: this.translate.instant('cancel'),
        handler: async () => {
          if (this.loaderService.loading !== undefined) {
            this.loaderService.dismiss();
          }
          return;
        }
      }
      ]
    });

    alert.present();
  }

  async addPic(fromSource, origin) {

    await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      allowEditing: fromSource === 'camera' ? true : false,
      width: 500,
      height: 500,
      //preserveAspectRatio: true,
      direction: CameraDirection.Front,
      correctOrientation: true,
      source: fromSource === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      quality: 80,
      saveToGallery: false

    })
    .then( capturedPhoto => {
        // this.loaderService.presentLoading();
        const blobData = this.b64toBlob(capturedPhoto.base64String, `image/${capturedPhoto.format}`);
        const imageName = 'my-avatar';

        this.avatarAsBlobSub$.next(
          {
            blob: blobData,
            imageName,
            capturedPhotoFormat: capturedPhoto.format,
            base64String: capturedPhoto.base64String
          }
        );

        if (origin === 'profile') {
          this.uploadPic(blobData, imageName, capturedPhoto.format)
            .pipe(
              catchError( error => of(console.log("uploadPic error: ", error))),
            )
            .subscribe( () => {});
        } else {
          if (this.loaderService.loading !== undefined) {
            this.loaderService.dismiss();
          }
        }
    });

  }

  uploadPic(blobData, imageName, capturedPhotoFormat) {
    return this.userService.get()
      .pipe(
        filter( user => user !== null),
        take(1),
        switchMap(user => {
          console.log(user, "<==== user")
          return this.accountService.sendAvatar(blobData, imageName, capturedPhotoFormat, user.body ? user.body["@id"] : user["@id"]);
        }),
        switchMap( () => {
          return this.authService.getConnectedUser();
        }),
        catchError( error => throwError(error))
      );
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
