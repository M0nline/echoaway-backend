// pour créer un module de test simulant l'environnement de NestJS
import { Test, TestingModule } from '@nestjs/testing';
//le service à tester
import { AccommodationsService } from './accommodations.service';

// on crée une suite de tests
describe('accommodationsService', () => {
  // on déclare une variable pour stocker une instance du service
  let service: AccommodationsService;
  //avant chaque test, on installe une instance du service
  beforeEach(async () => {
    // on crée un module de test NestJS
    const module: TestingModule = await Test.createTestingModule({
      // on ajoute le service à tester dans le tableau des providers
      providers: [AccommodationsService],
    }).compile();
    // on récupère une instance du service
    service = module.get<AccommodationsService>(AccommodationsService);
  });
  // on teste que le service est bien créé :
  // on décrit le test
  it('should be defined', () => {
    // on vérifie que la variable service n'est pas undefined
    expect(service).toBeDefined();
  });
});
