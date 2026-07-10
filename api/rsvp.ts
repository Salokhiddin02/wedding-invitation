declare const process: {
  env: {
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
  };
};
interface RsvpBody {
  attendance?: unknown;
  guestCount?: unknown;
}

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return json(
        {
          success: false,
          message: 'Faqat POST so‘rovi mumkin.'
        },
        405
      );
    }

    try {
      const body = await request.json() as RsvpBody;

      const attendance =
        body.attendance === 'yes'
          ? 'yes'
          : body.attendance === 'no'
            ? 'no'
            : null;

      const guestCount = Number(body.guestCount ?? 0);

      if (!attendance) {
        return json(
          {
            success: false,
            message: 'Javob noto‘g‘ri.'
          },
          400
        );
      }

      if (
        attendance === 'yes' &&
        (
          !Number.isInteger(guestCount) ||
          guestCount < 1 ||
          guestCount > 20
        )
      ) {
        return json(
          {
            success: false,
            message: 'Mehmonlar soni 1 dan 20 gacha bo‘lishi kerak.'
          },
          400
        );
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.error('Telegram environment variables topilmadi.');

        return json(
          {
            success: false,
            message: 'Telegram sozlamalari topilmadi.'
          },
          500
        );
      }

      const message =
        attendance === 'yes'
          ? [
              '💌 Yangi RSVP javobi',
              '',
              '✅ To‘yga keladi',
              `👥 Mehmonlar soni: ${guestCount} kishi`,
              '',
              '💍 Azamat & Zulayxo',
              '📅 19.07.2026'
            ].join('\n')
          : [
              '💌 Yangi RSVP javobi',
              '',
              '❌ To‘yga kela olmaydi',
              '',
              '💍 Azamat & Zulayxo',
              '📅 19.07.2026'
            ].join('\n');

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        }
      );

      const telegramText = await telegramResponse.text();

      if (!telegramResponse.ok) {
        console.error('Telegram API xatosi:', telegramText);

        return json(
          {
            success: false,
            message: 'Telegram guruhiga xabar yuborilmadi.'
          },
          502
        );
      }

      return json({
        success: true,
        message: 'Javob yuborildi.'
      });

    } catch (error) {
      console.error('RSVP function error:', error);

      return json(
        {
          success: false,
          message: 'Serverda xatolik yuz berdi.'
        },
        500
      );
    }
  }
};