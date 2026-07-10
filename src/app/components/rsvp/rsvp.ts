import { Component, signal } from '@angular/core';

type Attendance = 'yes' | 'no';

interface RsvpResponse {
  success?: boolean;
  message?: string;
}

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [],
  templateUrl: './rsvp.html',
  styleUrl: './rsvp.scss'
})
export class Rsvp {

  guestName = signal('');
  attendance = signal<Attendance | null>(null);
  guestCount = signal(1);

  sending = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  updateGuestName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.guestName.set(input.value);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  selectAttendance(value: Attendance): void {
    if (this.sending()) {
      return;
    }

    this.attendance.set(value);
    this.successMessage.set('');
    this.errorMessage.set('');

    if (value === 'no') {
      this.guestCount.set(0);
    } else if (this.guestCount() < 1) {
      this.guestCount.set(1);
    }
  }

  decreaseCount(): void {
    if (this.guestCount() > 1) {
      this.guestCount.update(value => value - 1);
    }
  }

  increaseCount(): void {
    if (this.guestCount() < 20) {
      this.guestCount.update(value => value + 1);
    }
  }

  async submit(): Promise<void> {
    const cleanName = this.guestName().trim();
    const selectedAttendance = this.attendance();

    this.successMessage.set('');
    this.errorMessage.set('');

    if (cleanName.length < 2) {
      this.errorMessage.set('Iltimos, ismingizni kiriting.');
      return;
    }

    if (!selectedAttendance) {
      this.errorMessage.set(
        'Iltimos, “Kelaman” yoki “Kela olmayman” javobini tanlang.'
      );
      return;
    }

    if (
      selectedAttendance === 'yes' &&
      (this.guestCount() < 1 || this.guestCount() > 20)
    ) {
      this.errorMessage.set(
        'Keladiganlar soni 1 dan 20 gacha bo‘lishi kerak.'
      );
      return;
    }

    this.sending.set(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName: cleanName,
          attendance: selectedAttendance,
          guestCount:
            selectedAttendance === 'yes'
              ? this.guestCount()
              : 0
        })
      });

      const rawText = await response.text();

      let result: RsvpResponse = {};

      try {
        result = rawText ? JSON.parse(rawText) as RsvpResponse : {};
      } catch {
        console.error('Server JSON qaytarmadi:', rawText);
      }

      if (!response.ok) {
        throw new Error(
          result.message || `Server xatosi: ${response.status}`
        );
      }

      this.successMessage.set('Rahmat! Javobingiz yuborildi.');

      this.guestName.set('');
      this.attendance.set(null);
      this.guestCount.set(1);

    } catch (error) {
      console.error('RSVP yuborish xatosi:', error);

      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : 'Javob yuborilmadi. Qayta urinib ko‘ring.'
      );
    } finally {
      this.sending.set(false);
    }
  }
}