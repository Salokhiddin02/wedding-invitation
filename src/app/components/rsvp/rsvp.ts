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

  attendance = signal<Attendance | null>(null);
  guestCount = signal(1);

  sending = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

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
    const selectedAttendance = this.attendance();

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
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendance: selectedAttendance,
          guestCount:
            selectedAttendance === 'yes'
              ? this.guestCount()
              : 0
        })
      });

      const result = await response.json() as RsvpResponse;

      if (!response.ok) {
        throw new Error(
          result.message || 'Javobni yuborib bo‘lmadi.'
        );
      }

      this.successMessage.set(
        selectedAttendance === 'yes'
          ? 'Rahmat! Javobingiz va mehmonlar soni yuborildi.'
          : 'Rahmat! Javobingiz yuborildi.'
      );

    } catch (error) {
      console.error('RSVP yuborish xatosi:', error);

      this.errorMessage.set(
        'Javob yuborilmadi. Internetni tekshirib, qayta urinib ko‘ring.'
      );
    } finally {
      this.sending.set(false);
    }
  }
}