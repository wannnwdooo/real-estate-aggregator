import { Component, OnInit } from '@angular/core';
import { AuthService } from '@src/app/services/api/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '@services/components/modal.service';
import { IApartment } from '@src/app/interfaces/apartments.interface';
import { ApartmentStateService } from '@services/state/apartment-state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  selectedApartment!: IApartment;
  isUpdateModalVisible = false;
  isCreateModalVisible = false;
  isAuth = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public modalService: ModalService,
    private apartmentStateService: ApartmentStateService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isLoggedIn) => {
      this.isAuth = isLoggedIn;
    });
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }

  onApartmentSelected(apartment: IApartment) {
    this.selectedApartment = apartment;
    this.isUpdateModalVisible = true;
    this.isCreateModalVisible = false;
    this.modalService.toggleModal();
  }

  onApartmentUpdateSuccess(updatedApartment: IApartment) {
    this.isUpdateModalVisible = false;
    this.isCreateModalVisible = false;
    this.modalService.toggleModal();
    this.selectedApartment = updatedApartment;
    this.apartmentStateService.updateApartment(this.selectedApartment);
  }

  onApartmentCreateSuccess(newApartment: IApartment) {
    this.isUpdateModalVisible = false;
    this.isCreateModalVisible = false;
    this.modalService.toggleModal();
    this.apartmentStateService.addApartment(newApartment);
  }

  onAddButtonClick(): void {
    this.isUpdateModalVisible = false;
    this.isCreateModalVisible = true;
    this.modalService.toggleModal();
  }
}
