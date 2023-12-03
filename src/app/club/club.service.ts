import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../shared/services/http.service';
import { ClubCourse } from './models/club-course';
import { ClubEvent } from './models/club-event';
import { Service } from './models/service';
import { Club } from '../shared/models/club';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(
    private httpService: HttpService  ) { }

  getClub(clubId: string): Observable<Club> {
    return this.httpService.baseHttp<Club>('get', `/clubs/${clubId}`, [], false);
  }

  appNeedUpdate(clubId) {
    return this.httpService.baseHttp<any>('get', `/clubs/${clubId}/white-label`, [], false);
  }

  // TODO: change the type with model
  getClubActivities(clubId: string): Observable<Array<any>> {
    return this.httpService.baseHttp<Array<any>>('get', `/activities?club.id=${clubId}`, [], false)
      .pipe(
        map( activitiesObject => {
          return activitiesObject['hydra:member'];
        })
      );
  }

  getClubServices(clubId: string): Observable<Array<Service>> {
    return this.httpService.baseHttp<Array<any>>('get', `/clubs/${clubId}/services`, [], false)
      .pipe(
        map( servicesObject => {
          return servicesObject['hydra:member'];
        })
      );
  }

  getClubEvents(_clubId: string): Observable<Array<ClubEvent>> {
    return of(
      [
        {
          id: 'fsdfdsfsd',
          clubId: 'dfsdfds',
          club_name: 'La Fisterie',
          price: 9,
          currency: '€',
          photo: 'assets/images/my-club-img-fixtures/event.png',
          startAt: new Date(),
          type: 'stage',
          name: 'perfectionnement trootball',
          category: 'football',
          levels: [1, 2, 3],
          max_attenders: 4,
          attenders: [
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'},
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'}
          ],
          gender: 1,
          limitRegistrationDate: new Date('Mon Oct 19 2020 15:00:00'),
          cancellationConditions: {type: 'stricte', condition: '24h00'},
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quas quis, eveniet nulla beatae, voluptates veniam ratione atque, ad praesentium totam. Magni assumenda placeat voluptate id laborum sunt harum alias.',
          address: { street: '176, rue de la frégate', zipCode:  '13014' , city: 'MARSEILLE'}
        },
        {
          id: 'fsdfdsfsd',
          clubId: 'dfsdfds',
          club_name: 'La Fisterie',
          price: 9,
          currency: '€',
          photo: 'assets/images/my-club-img-fixtures/event.png',
          startAt: new Date(),
          type: 'stage',
          name: 'perfectionnement trootball',
          category: 'football',
          levels: [1, 2, 3],
          max_attenders: 4,
          attenders: [
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'},
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'}
          ],
          gender: 1,
          limitRegistrationDate: new Date('Mon Oct 19 2020 15:00:00'),
          cancellationConditions: {type: 'stricte', condition: '24h00'},
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quas quis, eveniet nulla beatae, voluptates veniam ratione atque, ad praesentium totam. Magni assumenda placeat voluptate id laborum sunt harum alias.',
          address: { street: '176, rue de la frégate', zipCode:  '13014' , city: 'MARSEILLE'}

        },
        {
          id: 'fsdfdsfsd',
          clubId: 'dfsdfds',
          club_name: 'La Fisterie',
          price: 9,
          currency: '€',
          photo: 'assets/images/my-club-img-fixtures/event.png',
          startAt: new Date('Tue Oct 20 2020 15:00:00'),
          type: 'stage',
          name: 'perfectionnement trootball',
          category: 'football',
          levels: [1, 2, 3],
          max_attenders: 4,
          attenders: [
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'},
            {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'}
          ],
          gender: 1,
          limitRegistrationDate: new Date('Mon Oct 19 2020 15:00:00'),
          cancellationConditions: {type: 'stricte', condition: '24h00'},
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quas quis, eveniet nulla beatae, voluptates veniam ratione atque, ad praesentium totam. Magni assumenda placeat voluptate id laborum sunt harum alias.',
          address: { street: '176, rue de la frégate', zipCode:  '13014' , city: 'MARSEILLE'}

        }
      ]
    );
  }

  getClubEvent(_eventId): Observable<ClubEvent> {
    return of(
      {
        id: 'fsdfdsfsd',
        clubId: 'dfsdfds',
        club_name: 'La Fisterie',
        price: 9,
        currency: '€',
        photo: 'assets/images/my-club-img-fixtures/event.png',
        startAt: new Date('Tue Oct 20 2020 15:00:00'),
        type: 'stage',
        name: 'perfectionnement trootball',
        category: 'football',
        levels: [1, 2, 3],
        max_attenders: 4,
        attenders: [
          {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'},
          {id: 'fdfds', name: 'Zuu', level: 2, avatar: 'assets/images/avatar.png'}
        ],
        gender: 1,
        limitRegistrationDate: new Date('Mon Oct 19 2020 15:00:00'),
        cancellationConditions: {type: 'stricte', condition: '24h00'},
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio quas quis, eveniet nulla beatae, voluptates veniam ratione atque, ad praesentium totam. Magni assumenda placeat voluptate id laborum sunt harum alias.',
        address: { street: '176, rue de la frégate', zipCode:  '13014' , city: 'MARSEILLE'}
      }
    );
  }

  // TODO: change the type with model
  getClubCourses(_clubId: string): Observable<Array<ClubCourse>> {
    // TODO: implement api request
    return of(
      [
        {
          id: 'edfsdfsdfds',
          name: 'crossfit',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Réaliser différents événements enchaînements s’inspirant de la gymnastique & de la musculation.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/crossfit.png'
        },
        {
          id: 'edfsdfsdfdfgds',
          name: 'natation',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Des cours de natation avec un professeur expérimenté sont l’occasion de progresser plus rapidement.',
          date: new Date(),
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/swimming.png'
        },
        {
          id: 'edfsdfsdsdfdfgds',
          name: 'running',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Des cours de natation avec un professeur expérimenté sont l’occasion de progresser plus rapidement.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/running.png'
        },
        {
          id: 'edfssfdsfdsdfdfgds',
          name: 'yoga',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Réaliser différents enchaînements s’inspirant de la gymnastique & de la course à pied.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/yoga.png'
        },
        {
          id: 'edfssfdsfdsdfdfdfds',
          name: 'foot',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Des cours de foot avec un professeur expérimenté sont l’occasion de progresser plus rapidement.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/football.png'
        },
        {
          id: 'edfssfdsfdsdfdfdfds',
          name: 'foot',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Réaliser différents tours de piste et apprendre a pédaler correctement.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/cycling.png'
        },
        {
          id: 'edfssfdsfdsdfdfdfds',
          name: 'foot',
          levels: [1, 2, 3, 4, 5, 6],
          description: 'Apprendre a maîtriser les revers et les coups droits en s’inspirant des meilleurs joueurs du globe voir de la planète.',
          date: new Date(),
          duration: 60,
          attenders: 2,
          max_attenders: 4,
          photo: 'assets/images/my-club-img-fixtures/tennis.png'
        },
      ]
    );
  }

  getClubMatches(_clubId) {
    // TODO: implement api request
    return of(
      [
        {
          id: 'dfgdfgfd',
          name: 'Partie des Lopez',
          playground: {
            id: 'ferzez',
            name: 'Terrain 1',
            type: 'Terre battue',
            options: ['Filmé NGTV'],
            sport: {
              id: 'dgfdgdf',
              label: 'Tennis',
            },
            levels: [1, 2, 3, 4],
            date: new Date(),
            duration: 60,
            attenders: [
              {
                user_id: 'dgdsgd',
                avatar: 'assets/images/avatar.png',
                name: 'dsfdsf',
                preferences: [
                  {
                    sports: [
                      {
                        id: 'gffdgfd',
                        label: 'tennis',
                        level: 3
                      }
                    ]

                  }
                ]
              }
            ]
          }
        },
        {
          id: 'dfgdfgfd',
          name: 'Partie des Lopez',
          playground: {
            id: 'ferzez',
            name: 'Terrain 1',
            type: 'Terre battue',
            options: ['Filmé NGTV'],
            sport: {
              id: 'dgfdgdf',
              label: 'Tennis',
            },
            levels: [1, 2, 3, 4],
            date: new Date(),
            duration: 60,
            attenders: [
              {
                user_id: 'dgdsgd',
                avatar: 'assets/images/avatar.png',
                name: 'dsfdsf',
                preferences: [
                  {
                    sports: [
                      {
                        id: 'gffdgfd',
                        label: 'tennis',
                        level: 3
                      }
                    ]

                  }
                ]
              }
            ]
          }
        },
        {
          id: 'dfgdfgfd',
          name: 'Partie des Lopez',
          playground: {
            id: 'ferzez',
            name: 'Terrain 1',
            type: 'Terre battue',
            options: ['Filmé NGTV'],
            sport: {
              id: 'dgfdgdf',
              label: 'Tennis',
            },
            levels: [1, 2, 3, 4],
            date: new Date(),
            duration: 60,
            attenders: [
              {
                user_id: 'dgdsgd',
                avatar: 'assets/images/avatar.png',
                name: 'dsfdsf',
                preferences: [
                  {
                    sports: [
                      {
                        id: 'gffdgfd',
                        label: 'tennis',
                        level: 3
                      }
                    ]

                  }
                ]
              }
            ]
          }
        }
      ]
    );
  }
}
