# Symfony6 - PWA
Mise en application d'un projet Symfony avec Progressive Web Apps (PWA)

## Requirement
- PHP version:
	- `>=8.1`

## Infos plugins
- Bootstrap: `^5.3.1`
- Jquery: `^3.7.0`

## Installation
- Installing dependancies :
	- `php composer.phar install`
	- `yarn install`
	- `yarn encore dev`
	- `yarn encore production`

- Activate HTTPS Local :
	- `symfony server:ca:install`

- Starting the server :
	- `symfony serve --port=8000`

## Testing URLs
- https://127.0.0.1:8000/tests/what-watch
- https://127.0.0.1:8000/tests/webpack
- https://127.0.0.1:8000/tests/jsx