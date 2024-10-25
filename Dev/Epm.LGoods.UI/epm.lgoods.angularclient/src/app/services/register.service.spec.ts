import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistrationService } from './register.service';
import { RegistrationDto } from '../models/RegistrationDto';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistrationService]
    });
    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#register', () => {
    it('should return success response on successful registration', (done) => {
      const mockResponse = { success: true };
      const registrationDto: RegistrationDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        mobileNumber: '9876543210',
        accountType: 'User',
        businessName: '',
        city: '',
        state: '',
        zipCode: ''
      };

      service.register(registrationDto).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('#checkEmailExists', () => {
    it('should return true if email exists', (done) => {
      const email = 'existing.email@example.com';

      service.checkEmailExists(email).subscribe(response => {
        expect(response).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/CheckEmailExists?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if email does not exist', (done) => {
      const email = 'new.email@example.com';

      service.checkEmailExists(email).subscribe(response => {
        expect(response).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/CheckEmailExists?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('should handle errors during email existence check', () => {
      // Arrange
      const email = 'john.doe@example.com';
      const errorMessage = 'Email check failed due to server error';

      service.checkEmailExists(email).subscribe(
        () => fail('Expected an error, not successful response'),
        (error) => {
          // Assert
          expect(error.message).toContain(errorMessage);
        }
      );

      const req = httpMock.expectOne(`http://localhost:5002/api/Registration/CheckEmailExists?email=${email}`);
      expect(req.request.method).toBe('GET');

      // Simulate server error
      req.flush(null, { status: 500, statusText: errorMessage });
    });

    it('should handle error during registration and throw a new Error', () => {
      // Arrange
      const registrationDto: RegistrationDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        mobileNumber: '1234567890',
        accountType: 'User',
        businessName: '',
        city: '',
        state: '',
        zipCode: ''
      };

      const errorMessage = 'Registration failed due to server error';

      // Act
      service.register(registrationDto).subscribe(
        () => fail('Expected an error, not a successful response'),
        (error) => {
          // Assert
          expect(error.message).toContain(errorMessage);
        }
      );

      const req = httpMock.expectOne('http://localhost:5002/api/Registration');
      expect(req.request.method).toBe('POST');

      // Simulate server error
      req.flush(null, { status: 500, statusText: errorMessage });
    });

    it('should return error message on check email error', (done) => {
      const email = 'invalid.email@example.com';
      const mockError = { message: 'Invalid email' };

      service.checkEmailExists(email).subscribe({
        next: () => fail('should have failed with the invalid email error'),
        error: (error) => {
          const errorMessage = error?.error?.message || 'Unknown error';
          expect(errorMessage).toEqual('Invalid email');
          done();
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/CheckEmailExists?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });
});
