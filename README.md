<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## TODO

### Very important

* lock property on todos
* create MauCheckInput

### Normal flow

* archive property on todos
* query by archive
* filter by date
* order by date
* change layout to cards
* pagination mechanism
* toaster when todo query fails

### Not so important

* code organization

## Done 


### Recent

### < 05/11/2021 

* dark mode
* login leaking memory in front
* server validation for properties (required, date, email)
* client validation for properties (required, date, email)

### < 04/11/2021

* validate that the user is correct on update and delete (currentUser === todo.user)
* react animations
* todo move this to currentUser decorator
* todo maybe add some sort of validation to args { connectionParams:  { authorization: string; }}
* todo erase cache when logged out of application
* make a proper intersection for CatInputType
* date formatting react

## Resources

* [Graphql example](https://github.com/EricKit/nest-user-auth/tree/master/src/auth)
